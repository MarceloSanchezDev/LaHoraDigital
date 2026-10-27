import test from 'node:test';
import assert from 'node:assert/strict';
import {normalize,readingMinutes,relatedArticles} from '../src/services/editorialTools.js';
test('public text helpers handle accents and empty reading time',()=>{assert.equal(normalize('ÁRBOLES de Hurlingham'),'arboles de hurlingham');assert.equal(readingMinutes(''),1);assert.equal(readingMinutes(Array(221).fill('palabra').join(' ')),2);});
test('related articles exclude the current publication and duplicate slugs',()=>{const current={slug:'one',title:'Plaza de Hurlingham',categorySlug:'local'};const related={slug:'two',title:'Hurlingham y su plaza',categorySlug:'local'};const result=relatedArticles(current,[current,related,related,{slug:'other',title:'Tema distinto',categorySlug:'cine'}]);assert.deepEqual(result,[related]);});
