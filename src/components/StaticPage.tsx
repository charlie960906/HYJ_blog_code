import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import staticPages from '../data/staticPages';

interface StaticPageProps {
  pageKey: 'about' | 'friends';
}

const StaticPage: React.FC<StaticPageProps> = ({ pageKey }) => {
  const content = staticPages[pageKey];

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="glassmorphism-card p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">頁面未找到</h1>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首頁
          </Link>
        </div>
      </div>
    );
  }

  // 針對 about 頁面做專屬排版
  if (pageKey === 'about') {
    // 只渲染 glassmorphism-mini 開頭的區塊，排除頭像外層 div
    const cardHtmlList = content.content
      .split('<div class="glassmorphism-mini')
      .slice(1) // 跳過第一個頭像外層空區塊
      .map(html => '<div class="glassmorphism-mini' + html);

    return (
      <div className="min-h-screen pt-20 sm:pt-24 lg:pt-28 px-4 static-page-container">
        <div className="container mx-auto max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8 sm:mb-10 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首頁
          </Link>
          <div className="glassmorphism-card p-4 sm:p-6 lg:p-8 static-page-content">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8">
              {content.title}
            </h1>
            <div className="flex flex-col items-center mt-2">
              <img
                src="/images/my.jpg"
                alt="HYJ's Image"
                loading="lazy"
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover shadow-lg border-4 border-white/20"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
              />
              <div className="mt-2 text-2xl sm:text-3xl font-bold text-white text-center drop-shadow">
                嗨嗨嗨！我是老黃
              </div>
            </div>
            {/* 內容卡片分開渲染，確保有縫隙 */}
            <div className="space-y-6 mt-8">
              {cardHtmlList.map((html, idx) => (
                <div
                  key={idx}
                  className="prose prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 其他靜態頁面維持原本渲染
  return (
    <div className="min-h-screen pt-20 sm:pt-24 lg:pt-28 px-4 static-page-container">
      <div className="container mx-auto max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8 sm:mb-10 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回首頁
        </Link>
        <div className="glassmorphism-card p-4 sm:p-6 lg:p-8 static-page-content">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8">
            {content.title}
          </h1>
          <div
            className="prose prose-invert prose-sm sm:prose-base lg:prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default StaticPage;