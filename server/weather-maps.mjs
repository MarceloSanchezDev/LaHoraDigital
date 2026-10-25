export const MAP_LAYERS = ['temp_new','precipitation_new','clouds_new','wind_new','pressure_new'];

export function createWeatherMapsHandler({key,fetchImpl=fetch,now=Date.now}={}) {
  const cache=new Map(); const pending=new Map(); let retryAfter=0;
  return async function maps(req,res,next){
    const path=new URL(req.url,'http://localhost').pathname;
    if(!path.startsWith('/api/weather/maps/')){if(next)return next();res.writeHead(404);return res.end();}
    function fail(status,message){res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.writeHead(status);res.end(JSON.stringify({message}));}
    if(req.method!=='GET'){res.setHeader('Allow','GET');return fail(405,'Método no permitido.');}
    const match=path.match(/^\/api\/weather\/maps\/([a-z_]+)\/(\d{1,2})\/(\d{1,4})\/(\d{1,4})\.png$/);
    if(!match||!MAP_LAYERS.includes(match[1]))return fail(400,'Mapa no válido.');
    const [,layer,z,x,y]=match;
    if(Number(z)>10||Number(x)>=2**Number(z)||Number(y)>=2**Number(z))return fail(400,'Coordenadas no válidas.');
    if(!key)return fail(503,'Los mapas no están disponibles por el momento.');
    try{
      let tile=cache.get(path);
      if(!tile||tile.expires<=now()){
        if(now()<retryAfter)return fail(503,'Los mapas no están disponibles. Intentá más tarde.');
        if(!pending.has(path)){
          if(pending.size>=32)return fail(503,'El mapa está ocupado. Intentá nuevamente.');
          const promise=(async()=>{
            const url=new URL(`https://tile.openweathermap.org/map/${layer}/${Number(z)}/${Number(x)}/${Number(y)}.png`);
            url.searchParams.set('appid',key);
            const response=await fetchImpl(url,{signal:AbortSignal.timeout(10000),redirect:'error'});
            if(!response.ok||!response.headers.get('content-type')?.includes('image/png'))throw new Error('Map unavailable');
            const buffer=Buffer.from(await response.arrayBuffer());
            if(buffer.length>1024*1024||!buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw new Error('Invalid tile');
            const entry={buffer,expires:now()+600000};
            cache.delete(path);if(cache.size>=128)cache.delete(cache.keys().next().value);
            cache.set(path,entry);return entry;
          })().catch(error=>{retryAfter=now()+60000;throw error;}).finally(()=>pending.delete(path));
          pending.set(path,promise);
        }
        tile=await pending.get(path);
      }
      res.setHeader('Content-Type','image/png');res.setHeader('Cache-Control','public, max-age=600');
      res.setHeader('X-Content-Type-Options','nosniff');res.writeHead(200);res.end(tile.buffer);
    }catch{return fail(503,'No pudimos cargar esta capa meteorológica.');}
  };
}
