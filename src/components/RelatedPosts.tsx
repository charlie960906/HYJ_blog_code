import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types/post';
import { getRelatedPosts } from '../utils/posts';

interface RelatedPostsProps {
  currentPost: Post;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentPost }) => {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadRelatedPosts = async () => {
      const posts = await getRelatedPosts(currentPost);
      setRelatedPosts(posts);
    };

    loadRelatedPosts();
  }, [currentPost]);

  if (relatedPosts.length === 0) return null;

  return (
    <div className="mt-6 pt-6 border-t border-white/20">
      <h4 className="text-lg font-semibold text-white mb-4">相關文章</h4>
      <div className="space-y-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            to={`/post/${post.slug}`}
            className="block glassmorphism-mini p-4 hover:scale-105 transition-all duration-200"
          >
            <h5 className="text-white font-medium mb-2 line-clamp-2">
              {post.title}
            </h5>
            <p className="text-white/70 text-sm line-clamp-2">
              {post.summary}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;