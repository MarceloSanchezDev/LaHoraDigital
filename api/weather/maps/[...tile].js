import {createWeatherMapsHandler} from '../../../server/weather-maps.mjs';
const handler=createWeatherMapsHandler({key:process.env.OPENWEATHER_API_KEY});
export default function maps(req,res){return handler(req,res);}
