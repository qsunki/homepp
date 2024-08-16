import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { IoCloseSharp } from 'react-icons/io5';

interface ChatBotProps {
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ query: string; answer: string }[]>(
    [{ query: '', answer: '무엇을 도와드릴까요?' }]
  );
  const [input, setInput] = useState('');
  const chatBotRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // 메시지 끝 부분에 대한 참조 추가

  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
    scrollToBottom(); // 메시지가 업데이트될 때마다 스크롤
  }, [messages]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      chatBotRef.current &&
      !chatBotRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { query: input.trim(), answer: '' };
      setMessages([...messages, userMessage]);

      try {
        // API 요청 URL 수정
        const response = await axios.post<{ answer: string }>(
          'https://i11a605.p.ssafy.io/api/v1/chat',
          {
            query: input,
          }
        );
        const botMessage = { ...userMessage, answer: response.data.answer };
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg === userMessage ? botMessage : msg))
        );
      } catch (error) {
        // console.error('Failed to fetch chatbot response:', error);
        const errorMessage = {
          ...userMessage,
          answer: 'Error: Unable to fetch response',
        };
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg === userMessage ? errorMessage : msg))
        );
      }

      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 기본 Enter 동작(줄 바꿈)을 방지
      if (input.trim()) {
        sendMessage(); // 메시지 전송
      }
    }
  };

  return (
    <div
      ref={chatBotRef}
      className="fixed bottom-4 right-4 w-80 h-96 border border-gray-300 rounded-lg flex flex-col bg-white shadow-lg"
      style={{ zIndex: 100 }} // z-index를 100으로 설정
    >
      <div className="bg-blue-500 text-white py-2 rounded-t-lg flex justify-center items-center relative">
        <span className="font-semibold">Chat Bot</span>
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-white hover:bg-blue-600 rounded-full p-1 focus:outline-none"
        >
          <IoCloseSharp size={20} />
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-4">
            {msg.query && (
              <div className="text-right">
                <div className="inline-block bg-blue-100 text-blue-600 p-2 rounded-lg rounded-br-none mb-1">
                  {msg.query}
                </div>
              </div>
            )}
            {msg.answer && (
              <div className="text-left">
                <div className="inline-block bg-gray-200 text-gray-800 p-2 rounded-lg rounded-bl-none">
                  {msg.answer}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* 마지막 메시지 위치에 대한 참조 */}
      </div>
      <div className="flex p-2 border-t border-gray-200">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring focus:border-blue-300 resize-none"
          rows={1} // 기본적으로 한 줄로 표시되도록 설정
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none"
          style={{ height: '42px' }} // Send 버튼 높이 조정
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
