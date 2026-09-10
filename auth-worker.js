// Cherub OAuth callback service (Cloudflare Worker-compatible)
// Required secrets / variables:
//   GITHUB_CLIENT_ID       public OAuth app client ID
//   GITHUB_CLIENT_SECRET   secret; NEVER commit it
//   SESSION_SECRET         long random secret used to sign session cookies
//   ALLOWED_USERS          comma-separated GitHub logins, e.g. tyquan8900,seconduser
//   APP_ORIGIN             origin allowed to call this worker, e.g. https://example.pages.dev
//
// Routes:
//   GET /auth/login?return_to=https://app.example/
//   GET /auth/callback?code=...&state=...
//   GET /auth/session
//   POST /auth/logout

const enc = new TextEncoder();
const dec = new TextDecoder();

function json(data,status=200,extra={}){
  return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8',...extra}});
}
function b64url(bytes){
  let s=''; for(const b of bytes)s+=String.fromCharCode(b);
  return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function fromB64url(s){
  s=s.replace(/-/g,'+').replace(/_/g,'/'); while(s.length%4)s+='=';
  const bin=atob(s); return Uint8Array.from(bin,c=>c.charCodeAt(0));
}
async function hmac(secret,text){
  const key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  return b64url(new Uint8Array(await crypto.subtle.sign('HMAC',key,enc.encode(text))));
}
async function makeSession(env,obj){
  const body=b64url(enc.encode(JSON.stringify(obj)));
  return `${body}.${await hmac(env.SESSION_SECRET,body)}`;
}
async function readSession(env,cookie){
  const m=(cookie||'').match(/(?:^|;\s*)cherub_session=([^;]+)/); if(!m)return null;
  const [body,sig]=m[1].split('.'); if(!body||!sig)return null;
  if(await hmac(env.SESSION_SECRET,body)!==sig)return null;
  try{const o=JSON.parse(dec.decode(fromB64url(body)));if(o.exp&&Date.now()>o.exp)return null;return o}catch{return null}
}
function allowed(env,login){
  return String(env.ALLOWED_USERS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean).includes(String(login||'').toLowerCase());
}
function cors(env,origin){
  const ok=origin && env.APP_ORIGIN && origin===env.APP_ORIGIN;
  return ok?{'access-control-allow-origin':origin,'access-control-allow-credentials':'true','vary':'Origin'}:{};
}
function safeReturn(env,value){
  try{const u=new URL(value);if(env.APP_ORIGIN&&u.origin===env.APP_ORIGIN)return u.toString()}catch{}
  return env.APP_ORIGIN||'/';
}
function cookie(value,maxAge=60*60*24*7){
  return `cherub_session=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export default {
 async fetch(request,env){
  const url=new URL(request.url);
  const origin=request.headers.get('origin');
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...cors(env,origin),'access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'content-type'}});

  if(url.pathname==='/auth/login'){
    if(!env.GITHUB_CLIENT_ID||!env.GITHUB_CLIENT_SECRET||!env.SESSION_SECRET)return json({error:'OAuth service is not configured'},503);
    const returnTo=safeReturn(env,url.searchParams.get('return_to')||env.APP_ORIGIN);
    const nonce=crypto.randomUUID();
    const stateBody=b64url(enc.encode(JSON.stringify({nonce,returnTo,exp:Date.now()+10*60*1000})));
    const state=`${stateBody}.${await hmac(env.SESSION_SECRET,stateBody)}`;
    const callback=`${url.origin}/auth/callback`;
    const gh=new URL('https://github.com/login/oauth/authorize');
    gh.searchParams.set('client_id',env.GITHUB_CLIENT_ID);
    gh.searchParams.set('redirect_uri',callback);
    gh.searchParams.set('scope','repo');
    gh.searchParams.set('state',state);
    gh.searchParams.set('allow_signup','false');
    return Response.redirect(gh.toString(),302);
  }

  if(url.pathname==='/auth/callback'){
    const code=url.searchParams.get('code'); const state=url.searchParams.get('state')||'';
    const [body,sig]=state.split('.');
    let st=null;
    try{if(body&&sig&&await hmac(env.SESSION_SECRET,body)===sig)st=JSON.parse(dec.decode(fromB64url(body)))}catch{}
    const returnTo=safeReturn(env,st?.returnTo||env.APP_ORIGIN);
    if(!code||!st||Date.now()>st.exp){const r=new URL(returnTo);r.searchParams.set('auth_error','GitHub sign-in expired or was invalid.');return Response.redirect(r.toString(),302)}
    const callback=`${url.origin}/auth/callback`;
    const tokenResp=await fetch('https://github.com/login/oauth/access_token',{method:'POST',headers:{'accept':'application/json','content-type':'application/json'},body:JSON.stringify({client_id:env.GITHUB_CLIENT_ID,client_secret:env.GITHUB_CLIENT_SECRET,code,redirect_uri:callback})});
    const tokenData=await tokenResp.json();
    if(!tokenData.access_token){const r=new URL(returnTo);r.searchParams.set('auth_error','GitHub authorization failed.');return Response.redirect(r.toString(),302)}
    const userResp=await fetch('https://api.github.com/user',{headers:{'accept':'application/vnd.github+json','authorization':`Bearer ${tokenData.access_token}`,'user-agent':'Cherub'}});
    const user=await userResp.json();
    const isAllowed=allowed(env,user.login);
    const sess=await makeSession(env,{login:user.login,authorized:isAllowed,token:tokenData.access_token,exp:Date.now()+7*24*60*60*1000});
    const r=new URL(returnTo);if(!isAllowed)r.searchParams.set('auth_error','This GitHub account is not authorized for Cherub.');
    return new Response(null,{status:302,headers:{location:r.toString(),'set-cookie':cookie(sess)}});
  }

  if(url.pathname==='/auth/session'){
    const s=await readSession(env,request.headers.get('cookie'));
    if(!s)return json({authenticated:false,authorized:false},200,cors(env,origin));
    return json({authenticated:true,authorized:!!s.authorized,login:s.login},200,cors(env,origin));
  }

  if(url.pathname==='/auth/logout'&&request.method==='POST')return json({ok:true},200,{...cors(env,origin),'set-cookie':cookie('',0)});

  // Authenticated GitHub API proxy used by Cherub progress sync.
  if(url.pathname==='/api/progress'){
    const s=await readSession(env,request.headers.get('cookie'));
    if(!s?.authorized)return json({error:'Unauthorized'},401,cors(env,origin));
    const path=`users/${String(s.login).replace(/[^A-Za-z0-9-]/g,'')}/progress.json`;
    const api=`https://api.github.com/repos/tyquan8900/Cherub/contents/${path}`;
    const ghHeaders={'accept':'application/vnd.github+json','authorization':`Bearer ${s.token}`,'x-github-api-version':'2022-11-28','user-agent':'Cherub'};
    if(request.method==='GET'){
      const r=await fetch(`${api}?ref=main`,{headers:ghHeaders});
      if(r.status===404)return json({exists:false,progress:null,sha:null},200,cors(env,origin));
      if(!r.ok)return json({error:`GitHub read failed (${r.status})`},502,cors(env,origin));
      const j=await r.json();
      const raw=atob((j.content||'').replace(/\n/g,''));
      let text='';try{text=decodeURIComponent(Array.from(raw).map(c=>'%'+c.charCodeAt(0).toString(16).padStart(2,'0')).join(''))}catch{text=raw}
      let progress=null;try{progress=JSON.parse(text)}catch{}
      return json({exists:true,progress,sha:j.sha},200,cors(env,origin));
    }
    if(request.method==='PUT'){
      const body=await request.json();
      const text=JSON.stringify(body.progress??{},null,2);
      const bytes=enc.encode(text);let bin='';for(const b of bytes)bin+=String.fromCharCode(b);
      const payload={message:`Sync Cherub progress for ${s.login}`,content:btoa(bin),branch:'main'};if(body.sha)payload.sha=body.sha;
      const r=await fetch(api,{method:'PUT',headers:{...ghHeaders,'content-type':'application/json'},body:JSON.stringify(payload)});
      const j=await r.json().catch(()=>({}));
      if(!r.ok)return json({error:j.message||`GitHub save failed (${r.status})`,status:r.status},r.status===409?409:502,cors(env,origin));
      return json({ok:true,sha:j.content?.sha||null},200,cors(env,origin));
    }
  }

  return json({service:'Cherub auth',ok:true},200,cors(env,origin));
 }
};
