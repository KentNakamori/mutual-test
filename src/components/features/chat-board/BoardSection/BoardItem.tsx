// components/features/chat-board/BoardSection/BoardItem.tsx
import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

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

interface BoardItemProps {
  post: Post;
  onLike: (postId: string) => void;
  onClick: (postId: string) => void;
}

export default function BoardItem({ post, onLike, onClick }: BoardItemProps) {
  return (
    <article 
      onClick={() => onClick(post.id)}
      className="p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-2">{post.author.name}</span>
          <time>{format(new Date(post.created_at), 'yyyy/MM/dd HH:mm')}</time>
        </div>
        <span className="text-sm px-2 py-0.5 bg-gray-100 rounded-full">
          {post.category}
        </span>
      </div>

      <div className="flex items-center gap-4 mt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike(post.id);
          }}
          className="flex items-center gap-1 text-gray-500 hover:text-red-500"
        >
          <Heart
            size={18}
            className={post.liked ? 'fill-red-500 text-red-500' : ''}
          />
          <span className="text-sm">{post.likes}</span>
        </button>
        <div className="flex items-center gap-1 text-gray-500">
          <MessageCircle size={18} />
          <span className="text-sm">{post.comments.length}</span>
        </div>
        <div className="flex gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
