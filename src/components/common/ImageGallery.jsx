import {useEffect,useRef,useState} from 'react';
import ResponsiveImage from './ResponsiveImage';
export default function ImageGallery({images,title}){
 const [index,setIndex]=useState(null);const [zoom,setZoom]=useState(100);const dialog=useRef();const close=()=>setIndex(null);
 useEffect(()=>{if(index!==null){if(!dialog.current.open)dialog.current.showModal();setZoom(100);}else if(dialog.current?.open)dialog.current.close();},[index]);
 function move(delta){setIndex(i=>(i+delta+images.length)%images.length);}
 if(!images.length)return null;
 return <><div className="article-gallery">{images.map((img,i)=><button key={`${img.url}-${i}`} className={i===0?'gallery-cover':'gallery-thumb'} onClick={()=>setIndex(i)} aria-label={`Ampliar imagen ${i+1} de ${images.length}: ${img.alt||title}`}><ResponsiveImage src={img.url} alt={img.alt||(i===0?title:`Imagen adicional ${i+1}`)}/><span>{i===0?'Ampliar imagen':'Ver imagen'}</span></button>)}</div>
 <dialog ref={dialog} className="image-dialog" onCancel={close} onClose={close} aria-label={`Galería: ${title}`} onKeyDown={e=>{if(e.target.tagName==='INPUT')return;if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}}}>
 <header><span>Imagen {(index??0)+1} de {images.length}</span><button autoFocus onClick={close} aria-label="Cerrar galería">Cerrar ×</button></header>{index!==null&&<><div className="zoom-frame"><img src={images[index].url} alt={images[index].alt||title} style={{width:`${zoom}%`,maxWidth:'none'}}/></div><div className="gallery-controls"><button disabled={images.length<2} onClick={()=>move(-1)}>← Anterior</button><label>Zoom <input type="range" min="50" max="300" step="25" value={zoom} onChange={e=>setZoom(Number(e.target.value))}/>{zoom}%</label><button disabled={images.length<2} onClick={()=>move(1)}>Siguiente →</button><a href={images[index].url} target="_blank" rel="noreferrer">Abrir original ↗</a></div></>}
 </dialog></>;
}
