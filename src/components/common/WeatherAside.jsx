import {lazy,Suspense,useEffect,useState} from 'react';
import Weather from './Weather';
import styles from './WeatherAside.module.css';
const WeatherMap=lazy(()=>import('./WeatherMap'));
export default function WeatherAside(){
  const [collapsed,setCollapsed]=useState(()=>{try{return localStorage.getItem('lahora-weather-collapsed')==='true';}catch{return false;}});
  useEffect(()=>{try{localStorage.setItem('lahora-weather-collapsed',String(collapsed));}catch{}},[collapsed]);
  const [showMaps,setShowMaps]=useState(()=>window.matchMedia('(min-width: 1051px)').matches);
  if(collapsed)return <aside className={styles.aside} data-weather-collapsed="true" aria-label="Clima minimizado"><button className="weather-restore" onClick={()=>setCollapsed(false)}>☀ Mostrar clima y mapas</button></aside>;
  return <aside className={styles.aside} aria-labelledby="weather-aside-title"><div className={styles.card}><div className="weather-title-row"><span className="eyebrow">Nuestra ciudad</span><button className="quiet-button" onClick={()=>setCollapsed(true)} aria-label="Minimizar panel del clima">Minimizar −</button></div><h2 id="weather-aside-title">El tiempo en Hurlingham</h2><Weather/><button className={styles.toggle} aria-expanded={showMaps} aria-controls="weather-map-panel" onClick={()=>setShowMaps(s=>!s)}>{showMaps?'Ocultar mapas':'Explorar mapas del clima'} <span aria-hidden="true">{showMaps?'−':'+'}</span></button><div id="weather-map-panel" hidden={!showMaps}>{showMaps&&<Suspense fallback={<p role="status">Preparando mapas…</p>}><WeatherMap/></Suspense>}</div></div></aside>;
}
