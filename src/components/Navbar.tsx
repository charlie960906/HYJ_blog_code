import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 導航列立即顯示
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // 當搜尋框打開時自動聚焦
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    }
  }, [isSearchOpen]);

  // 點擊外部關閉搜尋框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSearchOpen && searchInputRef.current && !searchInputRef.current.closest('.search-container')?.contains(event.target as Node)) {
        if (!searchQuery.trim()) {
          setIsSearchOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen, searchQuery]);

  const navItems = [
    { name: '首頁', path: '/' },
    { name: '資訊', path: '/category/information' },
    { name: '評測', path: '/category/reviews' },
    { name: '財經', path: '/category/finance' },
    { name: '標籤', path: '/tags' },
    { name: '關於', path: '/about' },
    { name: '友情連結', path: '/friends' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 glassmorphism-nav transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <img
              src="/images/icon.jpg" // 替換為您的圖標路徑
              alt="HYJ's Blog Logo"
              className="w-10 h-10 rounded-lg object-contain"
            />
            <span className="text-xl font-semibold text-white hidden sm:block">
              HYJ's Blog
            </span>
          </Link>
          
          {/* 桌面版導航 */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="nav-item text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium px-2 py-1"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* 右側功能區 - 固定寬度容器 */}
          <div className="flex items-center justify-end" style={{ width: '200px' }}>
            {/* 桌面版搜尋 */}
            <div className="hidden md:block search-container relative">
              <div className="flex items-center justify-end">
                {/* 搜尋框 - 使用絕對定位從右側展開 */}
                <div 
                  className={`absolute right-12 top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-in-out ${
                    isSearchOpen 
                      ? 'opacity-100 scale-100 pointer-events-auto' 
                      : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                  style={{ 
                    transformOrigin: 'right center',
                    zIndex: 10
                  }}
                >
                  <form onSubmit={handleSearch}>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="搜尋文章..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48 px-4 py-2 pr-4 glassmorphism-input text-white placeholder-white/60 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }
                      }}
                    />
                  </form>
                </div>

                {/* 搜尋按鈕 - 固定位置 */}
                <button
                  onClick={toggleSearch}
                  className={`p-2 text-white/80 hover:text-white transition-all duration-200 hover:scale-105 relative z-20 ${
                    isSearchOpen ? 'text-blue-400' : ''
                  }`}
                  aria-label="搜尋"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 選單按鈕 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden lg:hidden text-white p-2 ml-2"
              aria-label="選單"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* 中等螢幕選單按鈕 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hidden md:block lg:hidden text-white p-2 ml-2"
              aria-label="選單"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* 手機版和中等螢幕選單 */}
        {isMenuOpen && (
          <div className="lg:hidden glassmorphism-card mt-2 p-4 space-y-4 animate-fadeIn">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="block text-white/80 hover:text-white transition-colors duration-200 py-2"
              >
                {item.name}
              </Link>
            ))}
            
            {/* 手機版搜尋 */}
            <div className="pt-4 border-t border-white/20">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜尋文章..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 glassmorphism-input text-white placeholder-white/60 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;