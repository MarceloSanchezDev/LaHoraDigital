// Public-repository UI tests use this contract fixture. Full-stack tests use e2e-server.mjs.
import {createServer} from 'node:http';
import {createServer as createViteServer} from 'vite';
import react from '@vitejs/plugin-react';
import {siteRoot,siteOrigin,apiOrigin} from './test-paths.mjs';
import {pngPixel} from './test-data.mjs';
const articles=[
  {id:1,slug:'plaza-renovada',title:'Plaza renovada en Hurlingham',excerpt:'Una plaza para los vecinos',body:'<p>Los vecinos plantaron árboles en la plaza renovada.</p>',categorySlug:'municipales',category:'Municipales',image:'/api/assets/fixture-image/content',publishedAt:'2026-10-20T12:00:00.000Z',readingMinutes:1},
  {id:2,slug:'club-del-barrio',title:'El club del barrio ganó el torneo',excerpt:'Deportes de nuestra comunidad',body:'<p>El equipo local ganó el torneo de fútbol.</p>',categorySlug:'deportes',category:'Deportes',image:null,publishedAt:null,readingMinutes:1},
];
const categories=[{slug:'municipales',name:'Municipales',description:'',count:1},{slug:'deportes',name:'Deportes',description:'',count:1}];
const api=createServer((req,res)=>{
  res.setHeader('Access-Control-Allow-Origin',siteOrigin);res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');
  const path=new URL(req.url,apiOrigin).pathname;
  const json=value=>res.end(JSON.stringify(value));
  if(path==='/api/site')return json({categories,homeArticles:articles,totalArticles:2});
  if(path==='/content/search.json')return json(Object.fromEntries(articles.map(a=>[a.slug,a.body.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()])));
  if(path.startsWith('/catalog/')){const scope=path.slice(9,-5);return json(articles.filter(a=>scope==='all'||a.categorySlug===scope));}
  if(path.startsWith('/api/published/')){const a=articles.find(a=>a.slug===path.slice(15));if(a)return json({...a,category:{slug:a.categorySlug,name:a.category},images:[]});}
  if(path==='/api/assets/fixture-image/content'){res.setHeader('Content-Type','image/png');return res.end(pngPixel());}
  res.statusCode=404;json({error:'Publicación inexistente.'});
}).listen(18733,'127.0.0.1');await new Promise((r,j)=>{api.once('listening',r);api.once('error',j);});
const site=await createViteServer({root:siteRoot,configFile:false,envDir:false,plugins:[react(),{name:'offline-weather',configureServer(server){server.middlewares.use('/api/weather',(_req,res)=>{res.statusCode=503;res.setHeader('Content-Type','application/json');res.end('{"available":false}');});}}],define:{'import.meta.env.VITE_PUBLIC_API_URL':JSON.stringify(apiOrigin)},server:{host:'127.0.0.1',port:18731,strictPort:true}});await site.listen();
const health=createServer((_req,res)=>res.end('ready')).listen(18730,'127.0.0.1');
async function stop(){health.close();api.close();await site.close();process.exit(0);}process.once('SIGTERM',stop);process.once('SIGINT',stop);
