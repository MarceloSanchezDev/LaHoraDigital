import { breakingNews } from '../../mocks/breakingNews';
import styles from './BreakingNewsTicker.module.css';
export default function BreakingNewsTicker(){return <section className={styles.ticker}><div className={`container ${styles.inner}`}><b><i/>Último momento</b><div className={styles.items}>{breakingNews.map(item=><span key={item}><i/>{item}</span>)}</div></div></section>}
