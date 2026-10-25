import {Navigate,useParams} from 'react-router-dom';
import {getCategoryBySlug} from '../services/newsService';
import NotFound from './NotFound';
export default function LegacyRedirect(){const {legacyFile}=useParams();if(legacyFile==='index.html')return <Navigate to="/" replace/>;const slug=legacyFile?.replace(/\.html?$/,'');return /\.html?$/.test(legacyFile)&&getCategoryBySlug(slug)?<Navigate to={`/secciones/${slug}`} replace/>:<NotFound/>;}
