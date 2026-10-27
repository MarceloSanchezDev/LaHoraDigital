import {publicApiPath,publicMediaPath} from './publicApi';
import {useEffect,useState} from 'react';
export default function usePublishedArticle(slug){
 const [attempt,setAttempt]=useState(0),[state,setState]=useState({slug,loading:true});
 useEffect(()=>{const abort=new AbortController();setState({slug,loading:true});fetch(publicApiPath('/api/published/'+encodeURIComponent(slug)),{signal:abort.signal}).then(async r=>{if(r.status===404)return {slug,loading:false,notFound:true};if(!r.ok)throw new Error();const a=await r.json();return {slug,loading:false,article:{...a,image:publicMediaPath(a.image),categorySlug:a.category.slug,category:a.category.name}};}).then(result=>{if(!abort.signal.aborted)setState(result);}).catch(()=>{if(!abort.signal.aborted)setState({slug,loading:false,error:true});});return()=>abort.abort();},[slug,attempt]);
 return {...(state.slug===slug?state:{slug,loading:true}),retry:()=>setAttempt(n=>n+1)};
}
