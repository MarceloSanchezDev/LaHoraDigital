import { articles } from '../mocks/news';
export const getArticles = () => articles;
export const getArticleBySlug = (slug) => articles.find((article) => article.slug === slug);
