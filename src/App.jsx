import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home/Home';
import {lazy,Suspense} from 'react';
const News=lazy(()=>import('./pages/News/News'));
const StaticPage=lazy(()=>import('./pages/StaticPage'));
const Article=lazy(()=>import('./pages/Article/Article'));
import NotFound from './pages/NotFound';
import LegacyRedirect from './pages/LegacyRedirect';

export default function App() { return <MainLayout><Suspense fallback={<div className="container" role="status">Cargando página…</div>}><Routes><Route path="/" element={<Home/>}/><Route path="/noticias" element={<News/>}/><Route path="/secciones/:categorySlug" element={<News/>}/><Route path="/noticias/:slug" element={<Article/>}/><Route path="/deportes" element={<Navigate to="/secciones/deportes" replace/>}/><Route path="/videos" element={<StaticPage type="videos"/>}/><Route path="/ediciones" element={<StaticPage type="ediciones"/>}/><Route path="/contacto" element={<StaticPage type="contacto"/>}/><Route path="/:legacyFile" element={<LegacyRedirect/>}/><Route path="*" element={<NotFound/>}/></Routes></Suspense></MainLayout>}
