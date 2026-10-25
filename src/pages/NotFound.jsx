import { Link } from 'react-router-dom';

export default function NotFound() {
  return <section className="container" style={{ paddingBlock: '64px' }}>
    <h1>No encontramos esta página</h1>
    <p>El enlace puede haber cambiado o la publicación todavía no está disponible.</p>
    <Link to="/noticias">Buscar en noticias →</Link>
  </section>;
}
