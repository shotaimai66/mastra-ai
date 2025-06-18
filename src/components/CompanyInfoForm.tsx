'use client';

import { useState } from 'react';

interface CompanyInfoFormProps {
  onSubmit: (title: string, content: string) => Promise<void>;
  isLoading: boolean;
}

export default function CompanyInfoForm({ onSubmit, isLoading }: CompanyInfoFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      await onSubmit(title, content);
      setTitle('');
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">会社情報を追加</h2>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          タイトル
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例：会社概要、サービス内容など"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          内容
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="会社の情報を入力してください..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !title.trim() || !content.trim()}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? '保存中...' : '保存'}
      </button>
    </form>
  );
}