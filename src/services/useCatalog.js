import {useEffect,useState} from 'react';
import {cachedCatalog,loadCatalog} from './catalogStore';
export default function useCatalog(scope='all'){
  const [attempt,setAttempt]=useState(0);const [state,setState]=useState({scope,articles:cachedCatalog(scope)||[],loading:!cachedCatalog(scope),error:false});
  useEffect(()=>{let active=true;if(!scope)return;const cached=cachedCatalog(scope);if(cached){setState({scope,articles:cached,loading:false,error:false});return;}setState({scope,articles:[],loading:true,error:false});loadCatalog(scope).then(articles=>{if(active)setState({scope,articles,loading:false,error:false});}).catch(()=>{if(active)setState({scope,articles:[],loading:false,error:true});});return()=>{active=false;};},[scope,attempt]);
  const cached=cachedCatalog(scope);const current=state.scope===scope?state:{scope,articles:cached||[],loading:!cached,error:false};
  return {...current,retry:()=>setAttempt(n=>n+1)};
}
