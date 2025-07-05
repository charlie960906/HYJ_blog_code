import React from 'react';
import { Link } from 'react-router-dom';
import { User, Tag as TagIcon } from 'lucide-react';

const Sidebar: React.FC = () => {
  const tags = [
    { name: '資訊', count: 15, color: 'bg-blue-500/20 text-blue-100 border-blue-400/30' },
    { name: '產品評價', count: 12, color: 'bg-green-500/20 text-green-100 border-green-400/30' },
    { name: '股市財經', count: 8, color: 'bg-yellow-500/20 text-yellow-100 border-yellow-400/30' },
    { name: '技術', count: 10, color: 'bg-purple-500/20 text-purple-100 border-purple-400/30' },
    { name: '生活', count: 6, color: 'bg-pink-500/20 text-pink-100 border-pink-400/30' },
    { name: '旅行', count: 4, color: 'bg-teal-500/20 text-teal-100 border-teal-400/30' }
  ];

  return (
    <aside className="space-y-6">
      {/* About Me */}
      <div className="glassmorphism-card p-6">
        <div className="flex items-center mb-4">
          <User className="w-5 h-5 text-blue-400 mr-2" />
          <h3 className="text-xl font-semibold text-white">關於我</h3>
        </div>
        <div className="space-y-3">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto">
            HYJ
          </div>
          <p className="text-white/80 text-sm text-center leading-relaxed">
            熱愛分享知識與經驗的部落客，專注於資訊科技、產品評測、股市分析等領域。
          </p>
          <div className="flex justify-center">
            <Link
              to="/about"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              了解更多 →
            </Link>
          </div>
        </div>
      </div>

      {/* Tag Cloud */}
      <div className="glassmorphism-card p-6">
        <div className="flex items-center mb-4">
          <TagIcon className="w-5 h-5 text-blue-400 mr-2" />
          <h3 className="text-xl font-semibold text-white">標籤雲</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              to={`/tags?tag=${encodeURIComponent(tag.name)}`}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105 ${tag.color}`}
            >
              {tag.name} ({tag.count})
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/tags"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            查看所有標籤 →
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;