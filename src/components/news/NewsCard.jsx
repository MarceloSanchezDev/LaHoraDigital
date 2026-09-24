import { Link } from 'react-router-dom';
import styles from './NewsCard.module.css';
export default function NewsCard({article}){return <article className={styles.card}><Link to={`/noticias/${article.slug}`}><div className={styles.image}><img src={article.image} alt=""/><span>{article.category}</span></div><div className={styles.body}><small>{article.date} · {article.location}</small><h3>{article.title}</h3><p>{article.excerpt}</p><div className={styles.read}>Leer crónica <span>→</span></div></div></Link></article>}
