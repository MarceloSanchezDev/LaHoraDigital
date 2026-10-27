import test from 'node:test';
import assert from 'node:assert/strict';
import {createWeatherMapsHandler,MAP_LAYERS} from '../server/weather-maps.mjs';

const png=Buffer.from([137,80,78,71,13,10,26,10,0,0]);
const tile='/api/weather/maps/temp_new/6/21/38.png';
async function call(handler,url=tile,method='GET'){
  const res={headers:{},setHeader(k,v){this.headers[k]=v;},writeHead(status){this.status=status;},end(body){this.body=body;}};
  await handler({url,method},res);return res;
}
test('tiles use only allowed layers and valid XYZ coordinates',async()=>{
  const handler=createWeatherMapsHandler({key:'fixture',fetchImpl:()=>{throw Error('Must not fetch');}});
  for(const url of ['/api/weather/maps/secret/6/21/38.png','/api/weather/maps/temp_new/11/21/38.png','/api/weather/maps/temp_new/2/21/38.png'])assert.equal((await call(handler,url)).status,400);
  assert.equal((await call(handler,'/api/weather/maps/../../test')).status,404);
  assert.equal((await call(handler,tile,'POST')).status,405);
  assert.equal((await call(createWeatherMapsHandler())).status,503);
});
test('all five layers proxy PNG tiles, hide the key and share bounded cache entries',async()=>{
  let calls=0;let clock=1000;
  const handler=createWeatherMapsHandler({key:'fixture-secret',now:()=>clock,fetchImpl:async url=>{
    calls++;assert.equal(url.hostname,'tile.openweathermap.org');assert.equal(url.searchParams.get('appid'),'fixture-secret');
    return {ok:true,headers:new Headers({'Content-Type':'image/png'}),arrayBuffer:async()=>png};
  }});
  const [a,b]=await Promise.all([call(handler),call(handler)]);assert.equal(calls,1);
  assert.equal(a.status,200);assert.deepEqual(a.body,png);assert.deepEqual(b.body,png);assert.ok(!a.body.toString().includes('fixture-secret'));
  for(const layer of MAP_LAYERS)assert.equal((await call(handler,`/api/weather/maps/${layer}/6/21/38.png`)).status,200);
  assert.equal(calls,5);
  clock+=600001;await call(handler);assert.equal(calls,6);
});
test('map errors are not returned as images and do not leak credentials',async()=>{
  let calls=0;
  const handler=createWeatherMapsHandler({key:'fixture-secret',fetchImpl:async()=>{calls++;return {ok:false};}});
  const result=await call(handler);assert.equal(result.status,503);assert.ok(!result.body.includes('fixture-secret'));
  await call(handler);assert.equal(calls,1);
});
test('non-PNG content is rejected even when upstream returns HTTP 200',async()=>{
  const handler=createWeatherMapsHandler({key:'fixture',fetchImpl:async()=>({ok:true,headers:new Headers({'content-type':'image/png'}),arrayBuffer:async()=>Buffer.from('not a png')})});
  assert.equal((await call(handler)).status,503);
});
