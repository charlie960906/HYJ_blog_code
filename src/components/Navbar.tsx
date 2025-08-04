import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 導航列立即顯示
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // 滾動檢測
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
    if (!isSearchOpen) {
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setIsSearchOpen(false);
    }
  };

  // 當搜尋框打開時自動聚焦
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    }
  }, [isSearchOpen]);

  // 點擊外部關閉選單和搜尋框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 關閉搜尋框
      if (isSearchOpen && searchInputRef.current && !searchInputRef.current.closest('.search-container')?.contains(event.target as Node)) {
        if (!searchQuery.trim()) {
          setIsSearchOpen(false);
        }
      }
      
      // 關閉選單
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen, isMenuOpen, searchQuery]);

  // ESC鍵關閉選單和搜尋框
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
    } ${isScrolled ? 'shadow-lg backdrop-blur-xl' : 'backdrop-blur-lg'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 flex-shrink-0 transition-transform duration-200 hover:scale-105"
            onClick={() => {
              setIsMenuOpen(false);
              setIsSearchOpen(false);
            }}
          >
            <img
              src="/images/icon.jpg"
              alt="HYJ's Blog Logo"
              loading="lazy"
              className="w-10 h-10 rounded-lg object-contain shadow-sm"
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
                className="nav-item text-white/80 hover:text-white transition-all duration-200 text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* 右側功能區 */}
          <div className="flex items-center justify-end space-x-2">
            {/* 桌面版搜尋 */}
            <div className="hidden md:block search-container relative">
              <div className="flex items-center justify-end">
                {/* 搜尋框 */}
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
                      className="w-48 px-4 py-2 pr-4 glassmorphism-input text-white placeholder-white/60 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/15"
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }
                      }}
                    />
                  </form>
                </div>

                {/* 搜尋按鈕 */}
                <button
                  onClick={toggleSearch}
                  className={`p-2 text-white/80 hover:text-white transition-all duration-200 hover:scale-105 hover:bg-white/10 rounded-lg relative z-20 ${
                    isSearchOpen ? 'text-blue-400 bg-white/10' : ''
                  }`}
                  aria-label="搜尋"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 手機版和中等螢幕選單按鈕 */}
            <button
              onClick={toggleMenu}
              className="md:hidden lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-105"
              aria-label="選單"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* 中等螢幕選單按鈕 */}
            <button
              onClick={toggleMenu}
              className="hidden md:block lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-105"
              aria-label="選單"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* 手機版和中等螢幕選單 */}
        {isMenuOpen && (
          <div 
            ref={menuRef}
            className="lg:hidden glassmorphism-card mt-2 p-4 space-y-4 animate-fadeIn border border-white/10"
          >
            {/* 導航項目 */}
            <div className="grid grid-cols-1 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-white/80 hover:text-white transition-all duration-200 py-3 px-4 rounded-lg hover:bg-white/10 font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* 手機版搜尋 */}
            <div className="pt-4 border-t border-white/20">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜尋文章..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-12 glassmorphism-input text-white placeholder-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/15"
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setIsMenuOpen(false);
                        setSearchQuery('');
                      }
                    }}
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
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