import editorial from '../data/site.json';
import groups from '../data/category-groups.json';
export const getCategoryGroups=(categories=editorial.categories)=>[...groups.map(group=>({...group,sections:categories.filter(c=>group.categories.includes(c.slug))})),...(categories.some(c=>!groups.some(g=>g.categories.includes(c.slug)))?[{slug:'otras',name:'Más secciones',categories:categories.filter(c=>!groups.some(g=>g.categories.includes(c.slug))).map(c=>c.slug),sections:categories.filter(c=>!groups.some(g=>g.categories.includes(c.slug)))}]:[])];
export const getCategories = () => editorial.categories;
export const getCategoryBySlug = slug => editorial.categories.find(c => c.slug === slug);
export const getEditorial = () => editorial;

const cache=new Map();
export async function getSearchIndex(){const r=await fetch('/content/search.json',{signal:AbortSignal.timeout(15000)});if(!r.ok)throw new Error('Búsqueda no disponible');return r.json();}
export async function getArticleBody(article){const category=article.categorySlug;if(!/^[-a-z0-9]+$/.test(category))throw new Error('Sección inválida');if(!cache.has(category))cache.set(category,fetch('/content/'+category+'.json',{signal:AbortSignal.timeout(15000)}).then(r=>{if(!r.ok)throw new Error('Publicación no disponible');return r.json();}).catch(error=>{cache.delete(category);throw error;}));const data=await cache.get(category);if(!data[article.slug])throw new Error('Publicación inexistente');return data[article.slug];}
