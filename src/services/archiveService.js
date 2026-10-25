import {loadCatalog} from './catalogStore';
let index;
export async function loadArchivedArticle(slug){index||=import('../data/article-index.json').then(module=>module.default);const category=(await index)[slug];if(!category)return null;return (await loadCatalog(category)).find(article=>article.slug===slug)||null;}
