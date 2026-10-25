const normalize = (value = '') => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es-AR');

// Pure query function shared by the listing and its tests. No invented dates or metrics.
export function queryArticles(articles, { search = '', category = 'Todas', author = '', from = '', to = '', searchIndex = null, sort = 'recent', page = 1, pageSize = 4 } = {}) {
  const term = normalize(search).trim();
  const matches = articles.filter(article =>
    (category === 'Todas' || article.category === category) &&
    (!author || article.author === author) &&
    (!(from || to) || (article.publishedAt && (!from || article.publishedAt.slice(0,10)>=from) && (!to || article.publishedAt.slice(0,10)<=to))) &&
    normalize([article.title, article.excerpt, article.content, article.category, article.location, article.author, searchIndex?.[article.slug]].filter(Boolean).join(' ')).includes(term)
  ).sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title, 'es-AR') : b.id - a.id);
  const size = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 4;
  const pageCount = Math.max(1, Math.ceil(matches.length / size));
  const currentPage = Math.min(pageCount, Math.max(1, Number.isInteger(page) ? page : 1));
  const offset = (currentPage - 1) * size;
  return { items: matches.slice(offset, offset + size), total: matches.length, pageCount, currentPage,
    from: matches.length ? offset + 1 : 0, to: Math.min(offset + size, matches.length) };
}
