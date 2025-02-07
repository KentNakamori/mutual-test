// components/features/chat-board/BoardSection/index.tsx
'use client';

import React, { useEffect, useState } from 'react';
import BoardHeader from './BoardHeader';
import BoardFilter from './BoardFilter';
import BoardList from './BoardList';

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

interface BoardSectionProps {
  categories: string[];
  posts: Post[];
  onFilter: (filters: unknown) => void;
  onSort: (sortParams: unknown) => void;
}

export default function BoardSection({
  categories,
  posts: initialPosts,
  onFilter,
  onSort
}: BoardSectionProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/v1/board/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setPosts(data.data);
        setHasMore(data.meta.total > data.data.length);
      } catch (error) {
        console.error('Fetch posts error:', error);
      }
    };

    fetchPosts();
  }, [selectedCategory, sortBy, searchQuery]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleLoadMore = async () => {
    try {
      const nextPage = page + 1;
      const response = await fetch(`/api/v1/board/posts?page=${nextPage}`);
      const data = await response.json();
      
      setPosts(prev => [...prev, ...data.data]);
      setHasMore(data.meta.total > posts.length + data.data.length);
      setPage(nextPage);
    } catch (error) {
      console.error('Load more posts error:', error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/v1/board/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, likes: data.data.likes, liked: data.data.liked }
            : post
        )
      );
    } catch (error) {
      console.error('Like post error:', error);
    }
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setPage(1);
    onFilter({ category });
  };

  const handleSortChange = (sort: 'latest' | 'popular') => {
    setSortBy(sort);
    setPage(1);
    onSort({ sort });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <BoardHeader
        onSearch={handleSearch}
        onCreatePost={() => {}}
      />
      <BoardFilter
        categories={categories}
        selectedCategory={selectedCategory}
        sortBy={sortBy}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        onClearFilters={() => {
          setSelectedCategory(null);
          setSortBy('latest');
          setSearchQuery('');
        }}
      />
      <BoardList
        posts={posts}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        onLike={handleLike}
        onPostClick={(postId) => console.log('Post clicked:', postId)}
      />
    </div>
  );
}