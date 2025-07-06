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
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(typeTimer);
  }, [typeIndex, isDeleting, currentSubtitle, subtitles]);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="text-center">
        <div className="glassmorphism-card p-12 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
            HYJ's Blog
          </h1>
          <div className="h-16 flex items-center justify-center">
            <p className="text-xl md:text-2xl text-blue-100 font-light">
              {displayText}
              <span className="typing-cursor">|</span>
            </p>
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-200"></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-400"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;