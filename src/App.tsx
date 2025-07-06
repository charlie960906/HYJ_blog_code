import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollProgress from './components/ScrollProgress';
import ScrollToTop from './components/ScrollToTop';
import StatsCorner from './components/StatsCorner';
import './styles.css';

// Lazy load components
const HomePage = lazy(() => import('./pages/HomePage'));
const PostPage = lazy(() => import('./components/PostPage'));
const TagCloudPage = lazy(() => import('./components/TagCloudPage'));
const StaticPage = lazy(() => import('./components/StaticPage'));

// 滾動到頂部組件
const ScrollToTopOnRouteChange: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <ScrollToTopOnRouteChange />
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* 滾動進度條 */}
        <ScrollProgress />
        
        {/* Background Image with Blur Effect */}
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
            filter: `blur(${Math.min(scrollY / 10, 20)}px)`,
            opacity: 0.3
          }}
        />
        
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/20" />
        
        {/* Content */}
        <div className="relative z-10">
          <Navbar />
          
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <HomePage />
                </>
              } />
              <Route path="/post/:slug" element={<PostPage />} />
              <Route path="/tags" element={<TagCloudPage />} />
              <Route path="/about" element={<StaticPage pageKey="about" />} />
              <Route path="/friends" element={<StaticPage pageKey="friends" />} />
              <Route path="/category/:category" element={<HomePage />} />
            </Routes>
          </Suspense>
          
          <Footer />
        </div>
        
        {/* 右下角統計 */}
        <StatsCorner />
        
        {/* 回到頂部按鈕 */}
        <ScrollToTop />
      </div>
    </Router>
  );
}

export default App;