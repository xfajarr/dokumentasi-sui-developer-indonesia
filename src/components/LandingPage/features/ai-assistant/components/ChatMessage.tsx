import React from 'react';
import ReactMarkdown from 'react-markdown';
import ChatMessageInterface from '../types';
import { cn } from '../../../lib/utils';

interface ChatMessageProps {
  message: ChatMessageInterface;
  isLast?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn("flex", isUser ? 'justify-end' : 'justify-start')}>
      <div 
        className={cn(
          "max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed",
          isUser 
            ? 'bg-sui-blue-600 text-white rounded-br-none' 
            : 'bg-sui-gray-800/80 text-sui-gray-200 rounded-bl-none border border-sui-gray-700/50'
        )}
      >
        {isUser ? (
          <p>{message.text}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;