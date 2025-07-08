import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getStaticPageContent } from '../data/staticPages';

interface StaticPageProps {
  pageKey: string;
}

const StaticPage: React.FC<StaticPageProps> = ({ pageKey }) => {
  const content = getStaticPageContent(pageKey);

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