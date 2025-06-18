'use client';

interface CompanyInfo {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface CompanyInfoListProps {
  items: CompanyInfo[];
  onDelete: (id: number) => Promise<void>;
  isLoading: boolean;
}

export default function CompanyInfoList({ items, onDelete, isLoading }: CompanyInfoListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        まだ会社情報が登録されていません
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">登録済み会社情報</h2>
      
      {items.map((item) => (
        <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-medium text-gray-800">{item.title}</h3>
            <button
              onClick={() => onDelete(item.id)}
              disabled={isLoading}
              className="text-red-600 hover:text-red-800 disabled:text-gray-400 transition-colors"
              title="削除"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-700 mb-3 whitespace-pre-wrap">{item.content}</p>
          
          <div className="text-sm text-gray-500">
            登録日時: {formatDate(item.created_at)}
          </div>
        </div>
      ))}
    </div>
  );
}