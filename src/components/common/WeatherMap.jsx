import {useEffect,useRef,useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './WeatherAside.module.css';
import MapLegend from './MapLegend';

const center=[-34.5894,-58.6391];
const layers=[
  {id:'temp_new',name:'Temperatura',description:'Distribución de la temperatura del aire en la región.'},
  {id:'precipitation_new',name:'Precipitaciones',description:'Distribución de precipitaciones. Las zonas sin color pueden no registrar lluvia en esta capa.'},
  {id:'clouds_new',name:'Nubosidad',description:'Cobertura de nubes sobre el mapa.'},
  {id:'wind_new',name:'Viento',description:'Distribución de la velocidad del viento.'},
  {id:'pressure_new',name:'Presión',description:'Distribución de la presión atmosférica al nivel del mar.'},
];
export default function WeatherMap(){
  const node=useRef();const map=useRef();const [layer,setLayer]=useState(layers[0].id);const [opacity,setOpacity]=useState(0.7);
  const [status,setStatus]=useState('loading');const [baseError,setBaseError]=useState(false);const [attempt,setAttempt]=useState(0);
  const overlay=useRef();
  useEffect(()=>{
    const instance=L.map(node.current,{scrollWheelZoom:false,minZoom:2,maxZoom:10,worldCopyJump:true}).setView(center,6);
    map.current=instance;
    const base=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:10,keepBuffer:0,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(instance);
    base.on('tileerror',()=>setBaseError(true));
    L.circleMarker(center,{radius:5,color:'#aa3000',fillColor:'#fff',fillOpacity:1,weight:2}).addTo(instance).bindTooltip('Hurlingham',{permanent:true,direction:'top'});
    const observer=new ResizeObserver(()=>instance.invalidateSize());observer.observe(node.current);
    return()=>{observer.disconnect();instance.remove();map.current=null;};
  },[]);
  useEffect(()=>{
    if(!map.current)return;
    setStatus('loading');let failed=false;
    const tile=L.tileLayer(`/api/weather/maps/${layer}/{z}/{x}/{y}.png`,{opacity:0.7,maxZoom:10,keepBuffer:0,attribution:'<a href="https://openweathermap.org/">OpenWeatherMap</a>'});
    tile.on('loading',()=>{if(!failed)setStatus('loading');});
    tile.on('tileerror',()=>{failed=true;setStatus('error');});
    tile.on('load',()=>setStatus(failed?'error':'ready'));
    overlay.current=tile;tile.addTo(map.current);
    const timer=setInterval(()=>{failed=false;tile.redraw();},600000);
    return()=>{clearInterval(timer);tile.off();tile.remove();overlay.current=null;};
  },[layer,attempt]);
  useEffect(()=>{overlay.current?.setOpacity(opacity);},[opacity,layer,attempt]);
  return <section aria-labelledby="weather-maps-title"><h3 id="weather-maps-title">Mapas del tiempo</h3>
    <label className={styles.label}>Elegí qué querés ver<select value={layer} onChange={e=>setLayer(e.target.value)}>{layers.map(l=><option value={l.id} key={l.id}>{l.name}</option>)}</select></label>
    <p className={styles.description}>{layers.find(l=>l.id===layer).description}</p>
    <div className={styles.map} ref={node} role="region" aria-label={`Mapa de ${layers.find(l=>l.id===layer).name} centrado en Hurlingham`}/>
    <MapLegend layer={layer}/>
    <div className={styles.mapTools}><button onClick={()=>map.current?.setView(center,6)}>Volver a Hurlingham</button><label>Intensidad <input type="range" min="0.2" max="1" step="0.1" value={opacity} onChange={e=>setOpacity(Number(e.target.value))}/></label></div>
    <p className={styles.status} role="status">{status==='loading'?'Cargando capa meteorológica…':status==='error'?'No pudimos cargar esta capa. Puede no estar disponible para tu cuenta o haber un problema de conexión.':'Capa meteorológica cargada.'}</p>
    {status==='error'&&<button className={styles.retry} onClick={()=>setAttempt(a=>a+1)}>Reintentar capa</button>}
    {baseError&&<p className={styles.status}>El mapa de calles no se pudo cargar por completo. Probá recargar la página.</p>}
    <p className={styles.help}>Arrastrá para recorrer el mapa y usá + / − para acercarte. Las capas muestran condiciones regionales; no son alertas oficiales.</p>
  </section>;
}
