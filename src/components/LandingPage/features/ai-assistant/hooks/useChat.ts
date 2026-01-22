import { useState } from 'react';
import ChatMessageInterface from '../types';
import { askGemini } from '../services/gemini.service';

export const useChat = () => {
  const [history, setHistory] = useState<ChatMessageInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (query: string) => {
    if (!query.trim()) return;

    const userMsg: ChatMessageInterface = { role: 'user', text: query };
    setHistory(prev => [...prev, userMsg]);
    setIsLoading(true);

    const answer = await askGemini(userMsg.text);

    const modelMsg: ChatMessageInterface = { role: 'model', text: answer };
    setHistory(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  return { history, isLoading, sendMessage };
};
