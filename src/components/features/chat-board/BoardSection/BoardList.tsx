// components/features/chat-board/BoardSection/BoardList.tsx
import React, { useEffect, useRef } from 'react';
import BoardItem from './BoardItem';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  category: string;
  tags: string[];
  likes: number;
  liked: boolean;
  comments: any[];
  created_at: string;
}

interface BoardListProps {
  posts: Post[];
  hasMore: boolean;
  onLoadMore: () => void;
  onLike: (postId: string) => void;
  onPostClick: (postId: string) => void;
}

export default function BoardList({
  posts,
  hasMore,
  onLoadMore,
  onLike,
  onPostClick
}: BoardListProps) {
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore) return;

    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onLoadMore();
      }
    }, options);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasMore, onLoadMore]);

  return (
    <div className="flex-1 overflow-y-auto">
      {posts.map((post) => (
        <BoardItem
          key={post.id}
          post={post}
          onLike={onLike}
          onClick={onPostClick}
        />
      ))}
      {hasMore && (
        <div ref={loadMoreRef} className="p-4 text-center text-gray-500">
          読み込み中...
        </div>
      )}
    </div>
  );
}
