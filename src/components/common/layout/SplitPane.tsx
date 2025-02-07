// components/common/layout/SplitPane.tsx
'use client';

import React, { useState, useCallback } from 'react';
import ResizeHandle from './ResizeHandle';

interface SplitPaneProps {
  defaultSplit: number;
  minSize: number;
  maxSize: number;
  children: [React.ReactNode, React.ReactNode];
}

export default function SplitPane({
  defaultSplit,
  minSize,
  maxSize,
  children
}: SplitPaneProps) {
  const [splitPosition, setSplitPosition] = useState(defaultSplit);
  
  const handleResize = useCallback((e: MouseEvent) => {
    const container = document.getElementById('split-container');
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const newPosition = (e.clientX / containerWidth) * 100;
    const boundedPosition = Math.min(
      Math.max(
        (minSize / containerWidth) * 100,
        newPosition
      ),
      (maxSize / containerWidth) * 100
    );

    setSplitPosition(boundedPosition);
  }, [minSize, maxSize]);

  return (
    <div id="split-container" className="flex h-full">
      <div style={{ width: `${splitPosition}%` }}>
        {children[0]}
      </div>
      <ResizeHandle onResize={handleResize} />
      <div style={{ width: `${100 - splitPosition}%` }}>
        {children[1]}
      </div>
    </div>
  );
}