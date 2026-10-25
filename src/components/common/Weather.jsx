import {useEffect,useState} from 'react';
import styles from './Weather.module.css';

export default function Weather(){
  const [state,setState]=useState({loading:true});
  useEffect(()=>{
    let active=true; let controller;
    async function refresh(){
      controller?.abort();controller=new AbortController();
      const timeout=setTimeout(()=>controller.abort(),10000);
      try{
        const response=await fetch('/api/weather',{signal:controller.signal});
        if(!response.ok)throw new Error();
        const data=await response.json();
        if(!Number.isFinite(data.temperature)||!Number.isFinite(data.feelsLike)||!data.condition||!Number.isFinite(Date.parse(data.updatedAt)))throw new Error();
        if(active)setState({data});
      }catch{if(active)setState({error:true});}finally{clearTimeout(timeout);}
    }
    refresh();const timer=setInterval(refresh,10*60*1000);
    return()=>{active=false;controller?.abort();clearInterval(timer);};
  },[]);
  const data=state.data;
  return <div className={styles.weather} aria-label="Clima de Hurlingham"><span>Hurlingham</span>{data?<><strong>{Math.round(data.temperature)} °C</strong><span>{data.condition}</span><span className={styles.detail}>Sensación {Math.round(data.feelsLike)} °C · Actualizado {new Intl.DateTimeFormat('es-AR',{hour:'2-digit',minute:'2-digit',timeZone:'America/Argentina/Buenos_Aires'}).format(new Date(data.updatedAt))}</span><a href="https://openweathermap.org/" target="_blank" rel="noreferrer" aria-label="Fuente del clima: OpenWeatherMap">OpenWeatherMap ↗</a></>:<span role="status">{state.loading?'Consultando clima…':'Clima no disponible por el momento'}</span>}</div>;
}
