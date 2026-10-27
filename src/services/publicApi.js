// Optional staging origin. Empty keeps the existing same-origin development API.
const origin=import.meta.env.VITE_PUBLIC_API_URL||'';
if(origin){
  const parsed=new URL(origin);
  if(parsed.origin!==origin||parsed.username||parsed.password||
    !(parsed.protocol==='https:'||parsed.protocol==='http:'&&['localhost','127.0.0.1'].includes(parsed.hostname)))
    throw new Error('La dirección del servicio de noticias debe ser un origen HTTPS válido.');
}
export const publicApiPath=path=>origin+path;
export const publicMediaPath=path=>typeof path==='string'&&/^\/(media\/|api\/assets\/)/.test(path)?origin+path:path;
