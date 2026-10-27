import test from 'node:test';
import assert from 'node:assert/strict';
import { queryArticles } from '../src/services/articleQuery.js';

const articles = [
  {id:1,title:'Educación pública',excerpt:'Inscripciones abiertas',category:'Educación',location:'Hurlingham'},
  {id:2,title:'Club del barrio',content:'Encuentro de vóley',category:'Deportes'},
  {id:3,title:'Biblioteca',category:'Cultura'},
  {id:4,title:'Teatro',category:'Cultura'},
  {id:5,title:'Música',category:'Cultura'},
];

test('pages have distinct records, real counts and bounded page numbers',()=>{
  const first=queryArticles(articles,{pageSize:2});
  const last=queryArticles(articles,{pageSize:2,page:99});
  assert.deepEqual(first.items.map(a=>a.id),[5,4]);
  assert.deepEqual(last.items.map(a=>a.id),[1]);
  assert.deepEqual([last.total,last.currentPage,last.pageCount,last.from,last.to],[5,3,3,5,5]);
  assert.equal(queryArticles(articles,{page:-5}).currentPage,1);
});
test('search ignores accents and matches section, content and location',()=>{
  for (const search of ['educacion','PUBLICA','HURLINGHAM']) assert.equal(queryArticles(articles,{search}).items[0].id,1);
  assert.equal(queryArticles(articles,{search:'voley'}).items[0].id,2);
  assert.equal(queryArticles(articles,{search:'deportes'}).total,1);
});
test('combined filters and empty results never report invented ranges',()=>{
  const empty=queryArticles(articles,{category:'Cultura',search:'club',page:3});
  assert.deepEqual([empty.items.length,empty.total,empty.from,empty.to,empty.currentPage],[0,0,0,0,1]);
  assert.equal(queryArticles([]).total,0);
});
test('title order does not mutate source records',()=>{
  const before=articles.map(a=>a.id);
  assert.equal(queryArticles(articles,{sort:'title'}).items[0].title,'Biblioteca');
  assert.deepEqual(articles.map(a=>a.id),before);
});
