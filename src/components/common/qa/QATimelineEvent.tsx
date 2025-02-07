import React from 'react';
import { Paperclip } from 'lucide-react';
import type { QAResponse } from '../../../types/models';

interface QATimelineEventProps {
  response: QAResponse;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export const QATimelineEvent: React.FC<QATimelineEventProps> = ({
  response,
  user
}) => {
  return (
    <div className="flex space-x-4 p-4">
      <div className="flex-shrink-0">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="font-medium text-gray-900">{user.name}</span>
            <span className="text-sm text-gray-500 ml-2">
              {new Date(response.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="text-gray-700 whitespace-pre-wrap">
          {response.content}
        </div>
        
        {response.attachments && response.attachments.length > 0 && (
          <div className="mt-3 space-y-1">
            {response.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <Paperclip size={16} />
                <span>{attachment.name}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
