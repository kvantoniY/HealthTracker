import assert from 'node:assert/strict';
const base = process.env.SMOKE_API_URL || 'http://localhost:4000';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname)) throw new Error('Используйте только локальный API');
let token='',cookie='';
const checks=[];
async function req(url,method='GET',body,status=200){
 const r=await fetch(base+url,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(cookie?{Cookie:cookie}:{})},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
 const text=await r.text();assert.equal(r.status,status,method+' '+url+' '+text.slice(0,200));
 const cookies=r.headers.getSetCookie();if(cookies.length)cookie=cookies.map(x=>x.split(';')[0]).join('; ');
 checks.push(method+' '+url+': '+r.status);return text?JSON.parse(text):null;
}
try {
 const id=Date.now().toString(36);
 const account={username:'demo_'+id,email:'demo_'+id+'@example.test',password:'Demo12345!'};

  token=(await req('/api/auth/register','POST',account)).token;assert.ok(token);
  const p=await req('/api/mood-entries','POST',{date:'2026-11-06',sleepHours:8,stressLevel:3,moodScore:80,notes:'Проверка '+id},201);assert.ok(p.data.id);
  const loaded=await req('/api/mood-entries/by-date/2026-11-06');assert.equal(loaded.data.id,p.data.id);
  await req('/api/mood-entries/'+p.data.id,'DELETE');
  await req('/api/posts');

 console.log('Проверка пройдена\n'+checks.join('\n'));
} catch(error) { console.error(error.message); process.exitCode=1; }
