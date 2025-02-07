// app/chat-board/page.tsx
'use client';

import React from 'react';
import SplitPane from '@/components/common/layout/SplitPane';
import ChatSection from '@/components/features/chat-board/ChatSection';
import BoardSection from '@/components/features/chat-board/BoardSection';

export default function ChatBoardPage() {
  return (
    <div className="h-screen bg-white">
      <SplitPane defaultSplit={50} minSize={300} maxSize={800}>
        <ChatSection 
          roomId="default-room"
          participants={[]} 
          onSendMessage={(message) => console.log('Send:', message)}
          onLoadMore={() => console.log('Load more')}
        />
        <BoardSection
          categories={[]}
          posts={[]}
          onFilter={() => console.log('Filter')}
          onSort={() => console.log('Sort')}
        />
      </SplitPane>
    </div>
  );
}