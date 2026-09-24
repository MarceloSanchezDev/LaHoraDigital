import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home/Home';
import News from './pages/News/News';
import StaticPage from './pages/StaticPage';

export default function App() { return <MainLayout><Routes><Route path="/" element={<Home/>}/><Route path="/noticias" element={<News/>}/><Route path="/noticias/:slug" element={<News/>}/><Route path="/deportes" element={<StaticPage type="deportes"/>}/><Route path="/videos" element={<StaticPage type="videos"/>}/><Route path="/ediciones" element={<StaticPage type="ediciones"/>}/><Route path="/contacto" element={<StaticPage type="contacto"/>}/><Route path="*" element={<Home/>}/></Routes></MainLayout>}
