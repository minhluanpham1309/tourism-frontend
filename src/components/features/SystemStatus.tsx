import React from 'react';
import { useApiStatus } from '@/hooks/useApiStatus';
import { RefreshCw, Network, Database, Brain, AlertTriangle } from 'lucide-react';

/** Một hàng pill trạng thái gọn — đặt ngay dưới ô tìm kiếm. */
export const SystemStatus: React.FC = () => {
  const { health, stats, isLoading, error, refetch } = useApiStatus();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-slate-400 py-2">
        <span className="animate-spin rounded-full h-4 w-4 border-2 border-slate-300 border-t-pink-500" />
        Đang kiểm tra hệ thống...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center gap-3 py-2">
        <span className="flex items-center gap-1.5 text-sm text-rose-600">
          <AlertTriangle className="h-4 w-4" /> Không kết nối được API
        </span>
        <button
          onClick={refetch}
          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-pink-600"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Thử lại
        </button>
      </div>
    );
  }

  const pill = (ok: boolean | undefined, icon: React.ReactNode, label: string) => (
    <span
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border ${
        ok
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
          : 'bg-slate-100 border-slate-200 text-slate-400'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-emerald-500' : 'bg-slate-300'}`} />
      {icon}
      {label}
    </span>
  );

  const totalNodes = stats?.database_stats?.total_nodes;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-1">
      {pill(health?.kg_service, <Network className="h-3.5 w-3.5" />, 'Knowledge Graph')}
      {pill(health?.vector_service, <Database className="h-3.5 w-3.5" />, 'Vector Search')}
      {pill(health?.intent_service, <Brain className="h-3.5 w-3.5" />, 'PhoBERT Intent')}
      {typeof totalNodes === 'number' && (
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-sky-50 border border-sky-200 text-sky-700">
          {totalNodes.toLocaleString('vi-VN')} nodes
        </span>
      )}
      <button
        onClick={refetch}
        title="Làm mới trạng thái"
        className="p-1.5 text-slate-400 hover:text-pink-600 transition-colors"
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
