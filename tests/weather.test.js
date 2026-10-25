import test from 'node:test';
import assert from 'node:assert/strict';
import {createWeatherHandler} from '../server/weather.mjs';

async function call(handler,method='GET'){
  const res={headers:{},setHeader(k,v){this.headers[k]=v;},writeHead(status){this.status=status;},end(body){this.body=body;}};
  await handler({url:'/api/weather',method},res);
  return res;
}
const payload={main:{temp:21.5,feels_like:22.3},dt:1792627200,weather:[{description:'cielo claro'}]};
test('weather stays unavailable without a server key and never fetches',async()=>{
  const res=await call(createWeatherHandler({fetchImpl:()=>{throw new Error('Must not fetch');}}));
  assert.equal(res.status,503);assert.ok(!res.body.includes('temperature'));
});
test('weather uses a fixed location, keeps the key private, coalesces requests and expires its cache',async()=>{
  let count=0;let time=1000;
  const handler=createWeatherHandler({key:'test-only-secret',now:()=>time,fetchImpl:async url=>{
    count++;assert.equal(url.hostname,'api.openweathermap.org');assert.equal(url.pathname,'/data/2.5/weather');assert.equal(url.searchParams.get('lat'),'-34.5894');assert.equal(url.searchParams.get('lon'),'-58.6391');assert.equal(url.searchParams.get('units'),'metric');assert.equal(url.searchParams.get('appid'),'test-only-secret');assert.equal(url.searchParams.get('lang'),'es');
    return {ok:true,json:async()=>payload};
  }});
  const [a,b]=await Promise.all([call(handler),call(handler)]);
  assert.equal(count,1);assert.equal(a.status,200);assert.equal(b.status,200);
  assert.equal(JSON.parse(a.body).temperature,21.5);assert.ok(!a.body.includes('test-only-secret'));
  await call(handler);assert.equal(count,1);
  time+=600001;await call(handler);assert.equal(count,2);
});
test('provider failures are sanitized and backed off; unsupported methods do not consume quota',async()=>{
  let count=0;
  const handler=createWeatherHandler({key:'test-only-secret',fetchImpl:async()=>{count++;throw new Error('URL containing test-only-secret');}});
  assert.equal((await call(handler,'POST')).status,405);assert.equal(count,0);
  const res=await call(handler);assert.equal(res.status,503);assert.ok(!res.body.includes('secret'));
  await call(handler);assert.equal(count,1);
});
test('malformed upstream data is not served as real weather',async()=>{
  const handler=createWeatherHandler({key:'test-only-secret',fetchImpl:async()=>({ok:true,json:async()=>({current:{temp_c:null}})})});
  assert.equal((await call(handler)).status,503);
});
