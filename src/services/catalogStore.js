const resolved=new Map();const pending=new Map();
export const cachedCatalog=()=>undefined;
export function loadCatalog(scope='all'){
  if(!pending.has(scope)){
    if(!/^[-a-z0-9]+$/.test(scope))return Promise.reject(new Error('Sección inválida'));
    const promise=fetch(`${import.meta.env.BASE_URL}catalog/${scope}.json`,{signal:AbortSignal.timeout(15000)}).then(r=>{if(!r.ok)throw new Error('No pudimos cargar las publicaciones.');return r.json();}).then(articles=>{if(!Array.isArray(articles))throw new Error('Invalid catalog');resolved.set(scope,articles);return articles;}).finally(()=>pending.delete(scope));
    pending.set(scope,promise);
  }
  return pending.get(scope);
}
