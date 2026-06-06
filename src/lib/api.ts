// API client for the RAG Tourism Recommender backend (FastAPI :8000).
// Reconstructed from its usages in hooks/useSearch.ts and hooks/useApiStatus.ts
// (the original src/lib/api.ts was missing from the repository).

import axios, { AxiosError, AxiosInstance } from 'axios';
import {
  TourismQuery,
  SearchResponse,
  HealthStatus,
  SystemStats,
  ApiError,
} from '@/types/tourism';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:8000';

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60_000, // first query can be slow (model warm-up)
  headers: { 'Content-Type': 'application/json' },
});

function toError(err: unknown): Error {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<ApiError>;
    const detail = ax.response?.data?.detail;
    if (detail) return new Error(detail);
    if (ax.code === 'ECONNABORTED') return new Error('Request timed out');
    if (!ax.response) return new Error(`Cannot reach API at ${API_BASE_URL}`);
    return new Error(`API error ${ax.response.status}`);
  }
  return err instanceof Error ? err : new Error('Unknown error');
}

export class TourismApiService {
  /** POST /search — hybrid NER → Intent → KG / vector pipeline. */
  static async searchLocations(query: TourismQuery): Promise<SearchResponse> {
    try {
      const { data } = await client.post<SearchResponse>('/search', query);
      return data;
    } catch (err) {
      throw toError(err);
    }
  }

  /** POST /stt/search — voice query: audio → PhoWhisper transcribe → search. */
  static async searchByVoice(audio: Blob, filename = 'voice.webm'): Promise<SearchResponse> {
    try {
      const form = new FormData();
      form.append('audio_file', audio, filename);
      form.append('use_vector_search', 'true');
      const { data } = await client.post<SearchResponse>('/stt/search', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120_000, // STT trên CPU có thể chậm
      });
      return data;
    } catch (err) {
      throw toError(err);
    }
  }

  /** GET /health — service liveness + per-service flags. */
  static async getHealthStatus(): Promise<HealthStatus> {
    try {
      const { data } = await client.get<HealthStatus>('/health');
      return data;
    } catch (err) {
      throw toError(err);
    }
  }

  /** GET /stats — Neo4j node/relationship counts. */
  static async getSystemStats(): Promise<SystemStats> {
    try {
      const { data } = await client.get('/stats');
      // Backend may return the stats object directly or wrapped.
      return (data?.database_stats ? data : { database_stats: data }) as SystemStats;
    } catch (err) {
      throw toError(err);
    }
  }
}

export default TourismApiService;
