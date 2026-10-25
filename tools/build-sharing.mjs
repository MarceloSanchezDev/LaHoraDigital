import {readFile,writeFile,mkdir} from 'node:fs/promises';
export const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function sharingTags(article,origin){
  const url=new URL(`/noticias/${article.slug}`,origin).href;
  const image=article.image?new URL(article.image,origin).href:null;
  return `<meta name="description" content="${escapeHtml(article.excerpt||article.title)}"><link rel="canonical" href="${escapeHtml(url)}"><meta property="og:type" content="article"><meta property="og:locale" content="es_AR"><meta property="og:site_name" content="La Hora Hurlingham"><meta property="og:title" content="${escapeHtml(article.title)}"><meta property="og:description" content="${escapeHtml(article.excerpt||article.title)}"><meta property="og:url" content="${escapeHtml(url)}">${image?`<meta property="og:image" content="${escapeHtml(image)}">`:''}<meta name="twitter:card" content="${image?'summary_large_image':'summary'}">`;
}
if(process.argv[1]?.endsWith('build-sharing.mjs')){
  const root=new URL('../',import.meta.url);const data=JSON.parse(await readFile(new URL('src/data/editorial.json',root),'utf8'));
  const redirects=data.categories.map(c=>`/${c.slug}.html /secciones/${c.slug} 301`).join('\n')+'\n/index.html / 301\n/* /index.html 200\n';
  await writeFile(new URL('dist/_redirects',root),redirects);
  for(const category of data.categories){const target=`/secciones/${category.slug}`;await writeFile(new URL(`dist/${category.slug}.html`,root),`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${target}"><title>${escapeHtml(category.name)} | La Hora</title></head><body><a href="${target}">Ver ${escapeHtml(category.name)}</a></body></html>`);}
  const configured=process.env.SITE_URL?.trim();
  if(!configured){console.log('Redirecciones históricas preparadas. Open Graph y sitemap: pendientes de configurar SITE_URL con el dominio final.');}
  else{
    const origin=new URL(configured);if(!['https:','http:'].includes(origin.protocol)||origin.username||origin.password||origin.pathname!=='/')throw new Error('SITE_URL debe ser el origen público, sin credenciales ni subcarpetas.');
    const template=await readFile(new URL('dist/index.html',root),'utf8');
    for(const article of data.articles){const path=`dist/noticias/${article.slug}/`;await mkdir(new URL(path,root),{recursive:true});const html=template.replace(/<title>.*?<\/title>/s,`<title>${escapeHtml(article.title)} | La Hora Hurlingham</title>`).replace('</head>',sharingTags(article,origin.origin)+'</head>');await writeFile(new URL(path+'index.html',root),html);}
    const paths=['/','/noticias','/ediciones','/videos','/contacto',...data.categories.map(c=>`/secciones/${c.slug}`),...data.articles.map(a=>`/noticias/${a.slug}`)];
    await writeFile(new URL('dist/sitemap.xml',root),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(path=>`<url><loc>${escapeHtml(new URL(path,origin.origin).href)}</loc></url>`).join('')+'</urlset>');
    await writeFile(new URL('dist/robots.txt',root),`User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml',origin.origin).href}\n`);console.log(`Open Graph y sitemap generados para ${data.articles.length} publicaciones.`);
  }
}
