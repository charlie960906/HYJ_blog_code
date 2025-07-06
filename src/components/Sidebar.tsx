import React from 'react';
import { Link } from 'react-router-dom';
import { User, Tag as TagIcon } from 'lucide-react';

const Sidebar: React.FC = () => {
  // 基於實際文章標籤的統計
  const tags = [
    { name: '技術', count: 2, color: 'bg-blue-500/20 text-blue-100 border-blue-400/30' },
    { name: 'React', count: 1, color: 'bg-cyan-500/20 text-cyan-100 border-cyan-400/30' },
    { name: 'TypeScript', count: 1, color: 'bg-blue-600/20 text-blue-100 border-blue-500/30' },
    { name: '前端開發', count: 2, color: 'bg-purple-500/20 text-purple-100 border-purple-400/30' },
    { name: '產品評價', count: 1, color: 'bg-green-500/20 text-green-100 border-green-400/30' },
    { name: 'iPhone', count: 1, color: 'bg-gray-500/20 text-gray-100 border-gray-400/30' },
    { name: '手機', count: 1, color: 'bg-indigo-500/20 text-indigo-100 border-indigo-400/30' },
    { name: '股市財經', count: 1, color: 'bg-yellow-500/20 text-yellow-100 border-yellow-400/30' },
    { name: '投資', count: 1, color: 'bg-green-600/20 text-green-100 border-green-500/30' },
    { name: '理財', count: 1, color: 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30' },
    { name: '旅行', count: 1, color: 'bg-teal-500/20 text-teal-100 border-teal-400/30' },
    { name: '日本', count: 1, color: 'bg-red-500/20 text-red-100 border-red-400/30' },
    { name: '京都', count: 1, color: 'bg-pink-500/20 text-pink-100 border-pink-400/30' },
    { name: '攻略', count: 1, color: 'bg-orange-500/20 text-orange-100 border-orange-400/30' },
    { name: '生活', count: 1, color: 'bg-lime-500/20 text-lime-100 border-lime-400/30' },
    { name: '工具', count: 1, color: 'bg-violet-500/20 text-violet-100 border-violet-400/30' },
    { name: '效率', count: 1, color: 'bg-sky-500/20 text-sky-100 border-sky-400/30' },
    { name: '推薦', count: 1, color: 'bg-rose-500/20 text-rose-100 border-rose-400/30' }
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
          {tags.slice(0, 12).map((tag) => (
            <Link
              key={tag.name}
              to={`/?tag=${encodeURIComponent(tag.name)}`}
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