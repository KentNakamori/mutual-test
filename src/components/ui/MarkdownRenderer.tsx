"use client";

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  useEffect(() => {
    // Prismjsを動的にロード
    import('prismjs').then((Prism) => {
      import('prismjs/components/prism-javascript');
      import('prismjs/components/prism-typescript');
      import('prismjs/components/prism-jsx');
      import('prismjs/components/prism-tsx');
      import('prismjs/components/prism-python');
      import('prismjs/components/prism-java');
      import('prismjs/components/prism-css');
      import('prismjs/components/prism-json');
      import('prismjs/components/prism-bash');
      import('prismjs/components/prism-sql');
    });
  }, []);

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // コードブロックのカスタマイズ
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            if (inline) {
              return (
                <code 
                  className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" 
                  {...props}
                >
                  {children}
                </code>
              );
            }
            
            return (
              <div className="my-4">
                {language && (
                  <div className="bg-gray-800 text-gray-300 px-3 py-1 text-xs font-mono rounded-t-md">
                    {language}
                  </div>
                )}
                <pre className={`${language ? 'rounded-t-none' : ''} bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto`}>
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          // テーブルのスタイリング
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200">
              {children}
            </td>
          ),
          // リンクのスタイリング
          a: ({ children, href }) => (
            <a 
              href={href}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          // 引用のスタイリング
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 italic">
              {children}
            </blockquote>
          ),
          // 水平線のスタイリング
          hr: () => (
            <hr className="my-6 border-t border-gray-300" />
          ),
          // リストのスタイリング
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 my-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 my-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="ml-4">
              {children}
            </li>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 