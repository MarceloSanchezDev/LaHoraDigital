export const normalize = (value='') => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es-AR');
export function readingMinutes(text=''){return Math.max(1,Math.ceil(text.trim().split(/\s+/).filter(Boolean).length/220));}
const ignore=new Set(['para','como','esta','este','desde','entre','sobre','hacia','hasta','pero','porque','nuestra','nuestro','tiene','todas','todos']);
export function relatedArticles(article,articles,limit=3){
  const words=new Set(normalize(article.title).match(/[a-z]{4,}/g)?.filter(w=>!ignore.has(w))||[]);
  return [...new Map(articles.map(a=>[a.slug,a])).values()].filter(a=>a.slug!==article.slug).map((a,index)=>({article:a,index,score:(a.categorySlug===article.categorySlug?2:0)+(normalize(a.title).match(/[a-z]{4,}/g)||[]).filter(w=>words.has(w)).length*3})).filter(a=>a.score>0).sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,limit).map(a=>a.article);
}
