import {createWeatherMapsHandler} from '../server/weather-maps.mjs';
const handler=createWeatherMapsHandler({key:process.env.OPENWEATHER_API_KEY});
export default function maps(req,res){const url=new URL(req.url,'http://localhost');if(!url.pathname.startsWith('/api/weather/maps/')){const query=req.query||Object.fromEntries(url.searchParams);const parts=[query.layer,query.z,query.x,query.tile];if(parts.some(part=>typeof part!=='string')){res.statusCode=400;return res.end('Ruta de mapa inválida');}req.url='/api/weather/maps/'+parts.map(encodeURIComponent).join('/');}return handler(req,res);}
