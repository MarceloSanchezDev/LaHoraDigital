import {createWeatherHandler} from '../server/weather.mjs';
const handler=createWeatherHandler({key:process.env.OPENWEATHER_API_KEY});
export default function weather(req,res){return handler(req,res);}
