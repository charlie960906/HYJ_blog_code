import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Tag } from 'lucide-react';
import { getTagsWithFrequency } from '../utils/tags';

interface TagData {
  name: string;
  count: number;
  size: number;
}

const TagCloudPage: React.FC = () => {
  const [tags, setTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tagData = await getTagsWithFrequency();
        setTags(tagData);
      } catch (error) {
        console.error('Failed to load tags:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTags();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="glassmorphism-card p-8 text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-white/80">載入標籤中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回首頁
        </Link>

        <div className="glassmorphism-card p-8">
          <div className="flex items-center mb-8">
            <Tag className="w-8 h-8 text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">標籤雲</h1>
          </div>

          {/* 標籤雲容器 */}
          <div className="tag-cloud-container">
            {tags.map((tag) => (
              <Link
                key={tag.name}
                to={`/?tag=${encodeURIComponent(tag.name)}`}
                className="tag-cloud-item"
                style={{
                  fontSize: `${tag.size}rem`,
                  opacity: Math.max(0.6, tag.count / Math.max(...tags.map(t => t.count)))
                }}
              >
                {tag.name}
                <span className="tag-count">({tag.count})</span>
              </Link>
            ))}
          </div>

          {/* 標籤統計 */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="glassmorphism-mini p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {tags.length}
                </div>
                <div className="text-sm text-white/70">總標籤數</div>
              </div>
              <div className="glassmorphism-mini p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {tags.reduce((sum, tag) => sum + tag.count, 0)}
                </div>
                <div className="text-sm text-white/70">標籤使用次數</div>
              </div>
              <div className="glassmorphism-mini p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {Math.max(...tags.map(t => t.count))}
                </div>
                <div className="text-sm text-white/70">最高使用次數</div>
              </div>
              <div className="glassmorphism-mini p-4 rounded-lg">
                <div className="text-2xl font-bold text-white">
                  {tags.filter(t => t.count > 1).length}
                </div>
                <div className="text-sm text-white/70">熱門標籤</div>
              </div>
            </div>
          </div>

          {/* 標籤列表 */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">所有標籤</h3>
            <div className="flex flex-wrap gap-2">
              {tags
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((tag) => (
                  <Link
                    key={`list-${tag.name}`}
                    to={`/?tag=${encodeURIComponent(tag.name)}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-100 border border-blue-400/30 hover:bg-blue-500/30 transition-all duration-200"
                  >
                    {tag.name} ({tag.count})
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagCloudPage;