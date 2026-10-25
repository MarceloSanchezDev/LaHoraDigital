import {useState} from 'react';
export default function ResponsiveImage({src,alt='',className='',eager=false,...props}){
 const [failed,setFailed]=useState(false);
 return !src||failed?<span className={`image-fallback ${className}`} role="img" aria-label={alt||'Imagen no disponible'}>La Hora · Imagen no disponible</span>:<img {...props} className={className} src={src} alt={alt} loading={eager?'eager':'lazy'} decoding="async" fetchPriority={eager?'high':'auto'} onError={()=>setFailed(true)}/>;
}
