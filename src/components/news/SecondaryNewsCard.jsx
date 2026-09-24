import { Link } from 'react-router-dom';import styles from './SecondaryNewsCard.module.css';
export default function SecondaryNewsCard({article}){return <Link to={`/noticias/${article.slug}`} className={styles.card}><img src={article.image} alt=""/><div><small>{article.category} · {article.date}</small><h3>{article.title}</h3><p>{article.excerpt}</p></div></Link>}
