import {useEffect,useState} from 'react';
import {Link,useParams,useLocation,useNavigate} from 'react-router-dom';
import {getArticleBody,getEditorial} from '../../services/newsService';
import {relatedArticles,readingMinutes} from '../../services/editorialTools';
import NewsCard from '../../components/news/NewsCard';
import ImageGallery from '../../components/common/ImageGallery';
import NotFound from '../NotFound';
import useCatalog from '../../services/useCatalog';
import usePublishedArticle from '../../services/usePublishedArticle';
import styles from './Article.module.css';
export default function Article(){
 const {slug}=useParams();const published=usePublishedArticle(slug);const article=published.article;const catalog=useCatalog(article?.categorySlug||null);const location=useLocation();const navigate=useNavigate();
 const [loaded,setLoaded]=useState(null);const body=loaded?.slug===slug?loaded.body:null;const [error,setError]=useState('');const [attempt,setAttempt]=useState(0);const [shareStatus,setShareStatus]=useState('');
 const [fontSize,setFontSize]=useState(()=>{try{return Math.min(26,Math.max(17,Number(localStorage.getItem('lahora-reading-size'))||19));}catch{return 19;}});
 useEffect(()=>{try{localStorage.setItem('lahora-reading-size',String(fontSize));}catch{}},[fontSize]);
 useEffect(()=>{let active=true;setError('');setShareStatus('');if(article)getArticleBody(article).then(data=>{if(active)setLoaded({slug,body:data});}).catch(()=>{if(active)setError('No pudimos cargar el texto. Intentá nuevamente.');});return()=>{active=false;};},[article,attempt,slug]);
 useEffect(()=>{if(!article)return;const oldTitle=document.title;document.title=`${article.title} | La Hora Hurlingham`;let meta=document.querySelector('meta[name="description"]');const created=!meta;if(!meta){meta=document.createElement('meta');meta.name='description';document.head.append(meta);}const previous=meta.content;meta.content=article.excerpt||article.title;return()=>{document.title=oldTitle;if(created)meta.remove();else meta.content=previous;};},[article]);

 if(published.loading)return <div className="container" role="status"><p>Cargando publicación…</p><div className="skeleton"/></div>;
 if(published.error)return <div className="container" role="alert"><p>No pudimos cargar esta publicación.</p><button onClick={published.retry}>Intentar nuevamente</button></div>;
 if(!article)return <NotFound/>;
 const related=relatedArticles(article,[...catalog.articles,...getEditorial().homeArticles]);const images=body?.images?.length?body.images:article.image?[{url:article.image,alt:article.title}]:[];
 const returnTo=typeof location.state?.from==='string'&&location.state.from.startsWith('/')&&!location.state.from.startsWith('//')?location.state.from:null;
 const url=window.location.href;const whatsapp=`https://wa.me/?text=${encodeURIComponent(article.title+'\n'+url)}`;
 async function share(){try{if(navigator.share)await navigator.share({title:article.title,url});else if(navigator.clipboard){await navigator.clipboard.writeText(url);setShareStatus('Enlace copiado.');}else setShareStatus('Copiá el enlace desde la barra de direcciones.');}catch(e){if(e.name!=='AbortError')setShareStatus('No pudimos compartir. Copiá el enlace desde la barra de direcciones.');}}
 return <div className={`container ${styles.page}`}><nav aria-label="Ruta de navegación"><Link to="/">Inicio</Link> / <Link to="/noticias">Publicaciones</Link> / <Link to={`/secciones/${article.categorySlug}`}>{article.category}</Link></nav><article className={styles.article}><Link className="eyebrow" to={`/secciones/${article.categorySlug}`}>{article.category}</Link><h1>{article.title}</h1>{article.titleDerived&&<p>Documento recuperado sin título explícito en el original.</p>}<p className="article-meta">{article.author?`Por ${article.author}`:'Archivo de La Hora'}{article.publishedAt&&` · ${article.publishedAt}`} · {body?readingMinutes(body.content):article.readingMinutes||1} min de lectura</p>
 <div className="reading-tools"><a className="whatsapp-button" href={whatsapp} target="_blank" rel="noreferrer">Compartir por WhatsApp</a><button onClick={share}>Copiar o compartir enlace</button><fieldset><legend>Tamaño del texto</legend><button disabled={fontSize<=17} onClick={()=>setFontSize(s=>s-1)} aria-label="Reducir tamaño del texto">A−</button><span aria-live="polite">{fontSize} px</span><button disabled={fontSize>=26} onClick={()=>setFontSize(s=>s+1)} aria-label="Aumentar tamaño del texto">A+</button></fieldset></div><p role="status">{shareStatus}</p>
 <ImageGallery key={slug} images={images} title={article.title}/>
 {!body&&!error&&<div role="status"><p>Cargando publicación…</p><div className="skeleton" aria-hidden="true"/></div>}{error&&<div role="alert"><p>{error}</p><button onClick={()=>setAttempt(a=>a+1)}>Intentar nuevamente</button></div>}
 {body&&<><div className={styles.body} style={{fontSize}}>{body.html?<div dangerouslySetInnerHTML={{__html:body.html}}/>:body.content?body.content.split(/\n+/).filter(Boolean).map((p,i)=><p key={i}>{p}</p>):<p>Esta publicación contiene un documento en imagen. Ampliá la imagen para consultarlo.</p>}</div>{body.links?.length>0&&<section><h2>Enlaces de la publicación</h2>{body.links.map((link,i)=><p key={i}><a href={link.url} target="_blank" rel="noreferrer">{link.text||link.url}</a></p>)}</section>}</>}
 {article.sourceUrl&&<p><a href={article.sourceUrl} target="_blank" rel="noreferrer">Consultar en el sitio original ↗</a></p>}</article>
 {related.length>0&&<section><h2>También te puede interesar</h2><div className={styles.related}>{related.map(a=><NewsCard key={a.slug} article={a}/>)}</div></section>}{returnTo?<button className="quiet-button" onClick={()=>navigate(-1)}>← Volver al listado anterior</button>:<Link to={`/secciones/${article.categorySlug}`}>← Volver a {article.category}</Link>}</div>;
}
