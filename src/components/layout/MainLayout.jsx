import Header from './Header';
import Footer from './Footer';
import WeatherAside from '../common/WeatherAside';
import {useEffect,useRef,useState} from 'react';
import {useLocation,useNavigationType} from 'react-router-dom';
const scrollPositions=new Map();
export default function MainLayout({children}){
 const location=useLocation();const navigationType=useNavigationType();const previousPath=useRef(location.pathname);const [showTop,setShowTop]=useState(false);
 useEffect(()=>{const previous=history.scrollRestoration;history.scrollRestoration='manual';return()=>{history.scrollRestoration=previous;};},[]);
 useEffect(()=>{
  const target=scrollPositions.get(location.key)||0;
  const restore=()=>{if(navigationType==='POP')window.scrollTo({top:target,behavior:'instant'});};
  const record=()=>{scrollPositions.set(location.key,window.scrollY);setShowTop(window.scrollY>500);};
  window.addEventListener('scroll',record,{passive:true});window.addEventListener('lahora-content-ready',restore,{once:true});
  const changedPage=previousPath.current!==location.pathname;previousPath.current=location.pathname;
  const frame=requestAnimationFrame(()=>{if(navigationType==='POP')restore();else if(navigationType!=='REPLACE'||changedPage)window.scrollTo({top:0,behavior:'instant'});setShowTop(window.scrollY>500);});
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',record);window.removeEventListener('lahora-content-ready',restore);};
 },[location.key,location.pathname,navigationType]);
 return <><a className="skip-link" href="#contenido">Ir al contenido</a><Header/><div className="editorial-shell"><main id="contenido" tabIndex={-1}>{children}</main><WeatherAside/></div><Footer/>{showTop&&<button className="back-to-top" onClick={()=>{window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.getElementById('contenido')?.focus({preventScroll:true});}}>↑ Volver arriba</button>}</>;
}
