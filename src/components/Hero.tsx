import React, { useState, useEffect } from 'react';

const Hero: React.FC = () => {
  const subtitles = [
    "I'm not the best but I work hard",
    "Keep fighting, Keep pushing", 
    "謝謝你在這個世界的角落發現了我",
    "持續更新中...",
    "這個世界很大等著我去探索"
  ];

  const [currentSubtitle, setCurrentSubtitle] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typeIndex, setTypeIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true); // 立即顯示

  // 立即開始打字動畫
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const currentText = subtitles[currentSubtitle];
    
    const typeTimer = setTimeout(() => {
      if (!isDeleting) {
        if (typeIndex < currentText.length) {
          setDisplayText(currentText.substring(0, typeIndex + 1));
          setTypeIndex(typeIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (typeIndex > 0) {
          setDisplayText(currentText.substring(0, typeIndex - 1));
          setTypeIndex(typeIndex - 1);
        } else {
          setIsDeleting(false);
          setTypeIndex(0);
          setCurrentSubtitle((prev) => (prev + 1) % subtitles.length);
        }
      }
    }, isDeleting ? 30 : 80); // 加快打字速度

    return () => clearTimeout(typeTimer);
  }, [typeIndex, isDeleting, currentSubtitle, subtitles]);

  return (
    <section className={`hero-section min-h-screen flex items-center justify-center px-4 pt-20 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`}>
      <div className="text-center max-w-6xl mx-auto">
        <div className="glassmorphism-card p-6 sm:p-8 md:p-12">
          <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
            HYJ's Blog
          </h1>
          <div className="h-12 sm:h-14 md:h-16 flex items-center justify-center">
            <p className="hero-subtitle text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 font-light px-2">
              {displayText}
              <span className="typing-cursor">|</span>
            </p>
          </div>
          <div className="mt-6 sm:mt-8 flex justify-center space-x-3 sm:space-x-4">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-400 rounded-full animate-pulse delay-200"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-pink-400 rounded-full animate-pulse delay-400"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;