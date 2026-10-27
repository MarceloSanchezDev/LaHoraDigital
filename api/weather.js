import {createWeatherHandler} from '../server/weather.mjs';
export default createWeatherHandler({key:process.env.OPENWEATHER_API_KEY});
