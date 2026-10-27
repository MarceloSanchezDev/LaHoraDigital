import {publicApiPath,publicMediaPath} from './publicApi';
import editorial from '../data/site.json';
import groups from '../data/category-groups.json';
export const getCategoryGroups=(categories=editorial.categories)=>[...groups.map(group=>({...group,sections:categories.filter(c=>group.categories.includes(c.slug))})),...(categories.some(c=>!groups.some(g=>g.categories.includes(c.slug)))?[{slug:'otras',name:'Más secciones',categories:categories.filter(c=>!groups.some(g=>g.categories.includes(c.slug))).map(c=>c.slug),sections:categories.filter(c=>!groups.some(g=>g.categories.includes(c.slug)))}]:[])];
export const getCategories = () => editorial.categories;
export const getCategoryBySlug = slug => editorial.categories.find(c => c.slug === slug);
export const getEditorial = () => editorial;
const cache = new Map();
let searchPromise;
export function getSearchIndex(){
  return searchPromise ||= fetch(publicApiPath('/content/search.json'),{signal:AbortSignal.timeout(15000)}).then(r=>{if(!r.ok)throw new Error('Search unavailable');return r.json();}).finally(()=>{searchPromise=null;});
}
export async function getArticleBody(article) {
  const response=await fetch(publicApiPath(`/api/published/${encodeURIComponent(article.slug)}`),{signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw new Error('No pudimos cargar esta publicación desde el servicio editorial.');
  const saved=await response.json();
  const base={html:saved.body.replace(/href="(\/api\/assets\/[-\w]+\/content)"/g,(_,path)=>'href="'+publicApiPath(path)+'"'),content:saved.body.replace(/<[^>]*>/g,' '),images:[...(saved.image?[{url:publicMediaPath(saved.image),alt:saved.title}]:[]),...(saved.images||[]).map(i=>({...i,url:publicMediaPath(i.url)}))],links:[]};
  return {...base,links:saved.links||[],images:[...new Map(base.images.map(image=>[image.url,image])).values()]};
}
