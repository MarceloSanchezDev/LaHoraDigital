import {publicApiPath,publicMediaPath} from './publicApi';
import {useEffect,useSyncExternalStore} from 'react';
import initial from '../data/site.json';
let state={data:initial,loading:true,error:false};let pending;const listeners=new Set();
function load(){return pending||=(async()=>{try{const r=await fetch(publicApiPath('/api/site'),{signal:AbortSignal.timeout(15000)});if(!r.ok)throw new Error();const data=await r.json();state={data:{...initial,...data,homeArticles:data.homeArticles.map(a=>({...a,image:publicMediaPath(a.image)})),report:{...initial.report,totalArticles:data.totalArticles}},loading:false,error:false};}catch{state={...state,loading:false,error:true};}finally{pending=null;for(const notify of listeners)notify();}})();}
export default function useSiteData(){const current=useSyncExternalStore(fn=>{listeners.add(fn);return()=>listeners.delete(fn);},()=>state);useEffect(()=>{load();},[]);return {...current,retry:load};}
