import { useState } from 'react';
import { TourismApiService } from '@/lib/api';
import { TourismQuery, SearchResponse, ConversationContext } from '@/types/tourism';

/**
 * Tìm kiếm + nhớ NGỮ CẢNH hội thoại: mỗi lần tìm, backend trả về `context`;
 * lượt sau FE gửi kèm để hiểu các câu nối tiếp như "còn chỗ nào khác?",
 * "cái thứ hai mở cửa mấy giờ", "còn ở Vũng Tàu thì sao".
 */
export const useSearch = () => {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [context, setContext] = useState<ConversationContext | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const search = async (query: TourismQuery, opts: { withContext?: boolean } = {}) => {
    const withContext = opts.withContext ?? true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await TourismApiService.searchLocations({
        ...query,
        context: withContext ? context : null,
      });
      setResults(response);
      setContext(response.context ?? null);
      setHistory((h) => [...h, query.text].slice(-5));
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      console.error('Search error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /** Tìm kiếm bằng giọng nói: gửi audio lên /stt/search (PhoWhisper → search). */
  const searchByVoice = async (audio: Blob, filename?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await TourismApiService.searchByVoice(audio, filename, context);
      setResults(response);
      setContext(response.context ?? null);
      setHistory((h) => [...h, response.query].slice(-5));
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Voice search failed';
      setError(errorMessage);
      console.error('Voice search error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /** Xóa kết quả và bắt đầu cuộc hỏi mới (quên ngữ cảnh). */
  const clearResults = () => {
    setResults(null);
    setError(null);
    setContext(null);
    setHistory([]);
  };

  return {
    results,
    isLoading,
    error,
    context,
    history,
    search,
    searchByVoice,
    clearResults,
  };
};
