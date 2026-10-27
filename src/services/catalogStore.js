import {publicApiPath,publicMediaPath} from './publicApi';
const resolved=new Map();const pending=new Map();
export const cachedCatalog=()=>undefined;
export function loadCatalog(scope='all'){
  if(!pending.has(scope)){
    if(!/^[-a-z0-9]+$/.test(scope))return Promise.reject(new Error('Sección inválida'));
    const promise=fetch(publicApiPath(`/catalog/${scope}.json`),{signal:AbortSignal.timeout(15000)}).then(r=>{if(!r.ok)throw new Error('No pudimos cargar las publicaciones.');return r.json();}).then(articles=>{if(!Array.isArray(articles))throw new Error('Invalid catalog');const mapped=articles.map(a=>({...a,image:publicMediaPath(a.image)}));resolved.set(scope,mapped);return mapped;}).finally(()=>pending.delete(scope));
    pending.set(scope,promise);
  }
  return pending.get(scope);
}
