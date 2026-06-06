// Types for the Tourism API
export interface TourismLocation {
  name: string;
  lat?: number;
  lng?: number;
  ward: string;
  province: string;
  confidence: number;
  source: string;
}

export interface TourismQuery {
  text: string;
  location?: string;
  category?: string;
  use_vector_search: boolean;
}

export interface IntentInfo {
  predicted_intent: string;
  confidence: number;
  method: string;
  description: string;
  all_probabilities?: Record<string, number>;
}

export interface SearchResponse {
  query: string;
  results: TourismLocation[];
  total: number;
  processing_time: number;
  search_method: string;
  intent_info?: IntentInfo;
}

export interface ApiError {
  detail: string;
}

export interface SystemStats {
  database_stats: {
    total_nodes?: number;
    total_relationships?: number;
    location_nodes?: number;
    province_nodes?: number;
    ward_nodes?: number;
  };
}

export interface HealthStatus {
  status: string;
  version: string;
  kg_service: boolean;
  vector_service: boolean;
  intent_service?: boolean;
}
