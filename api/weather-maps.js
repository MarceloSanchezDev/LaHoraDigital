import {createWeatherMapsHandler} from '../server/weather-maps.mjs';
const handler=createWeatherMapsHandler({key:process.env.OPENWEATHER_API_KEY});
export default function(req,res){const query=req.query||Object.fromEntries(new URL(req.url,'http://localhost').searchParams);const parts=[query.layer,query.z,query.x,query.tile];if(parts.some(part=>typeof part!=='string')){res.statusCode=400;return res.end('Ruta inválida');}req.url='/api/weather/maps/'+parts.map(encodeURIComponent).join('/');return handler(req,res);}
