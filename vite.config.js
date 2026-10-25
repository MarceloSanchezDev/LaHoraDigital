import {defineConfig,loadEnv} from 'vite';
import {createWeatherHandler} from './server/weather.mjs';
import {createWeatherMapsHandler} from './server/weather-maps.mjs';
export default defineConfig(({mode})=>{const env=loadEnv(mode,process.cwd(),'OPENWEATHER_');const key=process.env.OPENWEATHER_API_KEY||env.OPENWEATHER_API_KEY;function mount(server){server.middlewares.use(createWeatherMapsHandler({key}));server.middlewares.use(createWeatherHandler({key}));}return {plugins:[{name:'weather-only',configureServer:mount,configurePreviewServer:mount}]};});
