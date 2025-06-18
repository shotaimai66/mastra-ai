'use client';

import { useState, useEffect } from 'react';
import CompanyInfoForm from '@/components/CompanyInfoForm';
import CompanyInfoList from '@/components/CompanyInfoList';

interface CompanyInfo {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function AdminPage() {
  const [companyInfos, setCompanyInfos] = useState<CompanyInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCompanyInfos = async () => {
    try {
      const response = await fetch('/api/company-info');
      const data = await response.json();
      
      if (data.success) {
        setCompanyInfos(data.data);
      }
    } catch (error) {
      console.error('Error fetching company info:', error);
    }
  };

  const handleSubmit = async (title: string, content: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/company-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('会社情報が保存されました');
        fetchCompanyInfos();
      } else {
        alert('保存に失敗しました: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving company info:', error);
      alert('保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('この会社情報を削除してもよろしいですか？')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/company-info?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        alert('会社情報が削除されました');
        fetchCompanyInfos();
      } else {
        alert('削除に失敗しました: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting company info:', error);
      alert('削除に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyInfos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">会社情報管理</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <CompanyInfoForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
          
          <div>
            <CompanyInfoList 
              items={companyInfos} 
              onDelete={handleDelete} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}