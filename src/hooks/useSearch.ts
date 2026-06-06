import { useState } from 'react';
import { TourismApiService } from '@/lib/api';
import { TourismQuery, SearchResponse } from '@/types/tourism';

export const useSearch = () => {
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: TourismQuery) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await TourismApiService.searchLocations(query);
      setResults(response);
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
      const response = await TourismApiService.searchByVoice(audio, filename);
      setResults(response);
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

  const clearResults = () => {
    setResults(null);
    setError(null);
  };

  return {
    results,
    isLoading,
    error,
    search,
    searchByVoice,
    clearResults,
  };
};
