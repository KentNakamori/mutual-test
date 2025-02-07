// components/common/layout/ResizeHandle.tsx
'use client';

import React, { useCallback, useEffect, useState } from 'react';

interface ResizeHandleProps {
  onResize: (e: MouseEvent) => void;
}

export default function ResizeHandle({ onResize }: ResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onResize(e);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onResize]);

  return (
    <div
      className="w-1 cursor-col-resize bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition-colors"
      onMouseDown={handleMouseDown}
    />
  );
}
