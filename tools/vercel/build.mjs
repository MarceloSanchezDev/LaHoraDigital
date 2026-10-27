import {spawnSync} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
const mode=process.argv[2];
const run=args=>{const result=spawnSync(process.execPath,args,{stdio:'inherit',env:process.env,windowsHide:true});if(result.status!==0)process.exit(result.status||1);};
if(mode==='public-site'){
  let url;try{url=new URL(process.env.VITE_PUBLIC_API_URL);}catch{}
  if(!url||url.protocol!=='https:'||url.origin!==process.env.VITE_PUBLIC_API_URL||url.username||url.password)throw new Error('Configurar VITE_PUBLIC_API_URL con el origen HTTPS de la API antes de compilar.');
  run(['node_modules/vite/bin/vite.js','build']);
}else if(['editorial','public-api'].includes(mode)){
  const required=mode==='editorial'?['EDITORIAL_DATABASE_URL','SUPABASE_URL','SUPABASE_PUBLISHABLE_KEY','EDITORIAL_UPLOAD_SECRET']:['PUBLIC_DATABASE_URL','SUPABASE_URL','SUPABASE_PUBLISHABLE_KEY','PUBLIC_SITE_ORIGIN'];
  for(const name of required)if(!process.env[name])throw new Error('Falta configurar '+name+' en las variables del proyecto Vercel.');
  process.env.DATABASE_URL=mode==='editorial'?process.env.EDITORIAL_DATABASE_URL:process.env.PUBLIC_DATABASE_URL;
  // Bundle the sanitizer and its ESM parser together for Vercel's CommonJS loader.
  // Keep upstream versions and security behavior; do not downgrade the parser.
  const {build}=await import('esbuild');
  await build({entryPoints:['sanitize-html'],bundle:true,platform:'node',format:'cjs',target:'node22',outfile:'server/generated/sanitize-html.cjs'});
  const editorialPath='server/editorial.mjs';
  const editorialSource=await readFile(editorialPath,'utf8');
  await writeFile(editorialPath,editorialSource.replace("from 'sanitize-html'", "from './generated/sanitize-html.cjs'"));
  run(['node_modules/prisma/build/index.js','generate']);
  if(mode==='editorial')run(['node_modules/vite/bin/vite.js','build','--config','apps/editorial/vite.config.js']);
  else{await mkdir('public',{recursive:true});await writeFile('public/robots.txt','User-agent: *\nDisallow: /\n');}
}else throw new Error('Elegir editorial, public-api o public-site.');
