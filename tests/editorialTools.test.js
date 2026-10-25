import test from 'node:test';
import assert from 'node:assert/strict';
import {readingMinutes,relatedArticles} from '../src/services/editorialTools.js';
import {queryArticles} from '../src/services/articleQuery.js';
import {sharingTags} from '../tools/build-sharing.mjs';
import {readFile,readdir} from 'node:fs/promises';
test('full-text search and author filters combine with pagination',()=>{
  const articles=[{id:1,slug:'a',title:'Una historia',category:'Cultura',author:'Ana'},{id:2,slug:'b',title:'Otra historia',category:'Cultura',author:'Pedro'}];
  const result=queryArticles(articles,{search:'orquesta',searchIndex:{a:'Participaron en una orquesta',b:'Otra información'},author:'Ana',category:'Cultura'});
  assert.equal(result.total,1);assert.equal(result.items[0].slug,'a');
  assert.equal(queryArticles(articles,{author:'Nadie'}).total,0);
});
test('unknown publication dates are excluded only when filtering dates',()=>{
  const articles=[{id:1,title:'A',publishedAt:null},{id:2,title:'B',publishedAt:'2026-10-20'},{id:3,title:'C',publishedAt:'2026-10-22'}];
  assert.equal(queryArticles(articles).total,3);assert.equal(queryArticles(articles,{from:'2026-10-20',to:'2026-10-21'}).items[0].title,'B');
});
test('reading time is derived from content and related results prioritize shared topics',()=>{
  assert.equal(readingMinutes('palabra '.repeat(441)),3);
  const article={slug:'a',title:'La orquesta de Hurlingham',categorySlug:'cultura'};
  const result=relatedArticles(article,[article,{slug:'b',title:'Una muestra de pintura',categorySlug:'cultura'},{slug:'c',title:'La orquesta recibe instrumentos',categorySlug:'cultura'}]);
  assert.equal(result[0].slug,'c');assert.ok(result.every(a=>a.slug!=='a'));
});
test('share metadata escapes untrusted titles and points to the configured site',()=>{
  const tags=sharingTags({slug:'prueba',title:'"/><script>alert(1)</script>',excerpt:'A & B',image:'/media/foto.jpg'},'https://example.com');
  assert.ok(!tags.includes('<script>'));assert.match(tags,/&lt;script&gt;/);assert.match(tags,/https:\/\/example.com\/noticias\/prueba/);assert.match(tags,/https:\/\/example.com\/media\/foto.jpg/);
});
test('split catalogs preserve every route, groups cover all sections and local image files exist',async()=>{
  const json=async path=>JSON.parse(await readFile(new URL('../'+path,import.meta.url),'utf8'));
  const all=await json('public/catalog/all.json');const site=await json('src/data/site.json');const index=await json('src/data/article-index.json');const groups=await json('src/data/category-groups.json');
  assert.equal(all.length,site.report.totalArticles);assert.ok(site.homeArticles.length<=13);assert.equal(new Set(groups.flatMap(g=>g.categories)).size,site.categories.length);
  const imageFiles=new Set(await readdir(new URL('../public/media/',import.meta.url)));
  for(const category of site.categories){
    const articles=await json(`public/catalog/${category.slug}.json`);assert.equal(articles.length,category.count);
    for(const article of articles){assert.equal(index[article.slug],category.slug);if(article.image){assert.ok(article.image.startsWith('/media/'));assert.ok(imageFiles.has(article.image.slice('/media/'.length)));}}
  }
  const search=await json('public/content/search.json');assert.equal(Object.keys(search).length,all.length);
});
