// Types for the Tourism API
export interface TourismLocation {
  name: string;
  lat?: number | null;
  lng?: number | null;
  ward: string;
  province: string;
  confidence: number;
  source: string;
  category?: string | null;
  // chi tiết (có khi hỏi giờ mở cửa / SĐT / "gần X")
  address?: string | null;
  phone?: string | null;
  opening_hours?: string | null;
  description?: string | null;
  distance_km?: number | null;
}

/** Ngữ cảnh hội thoại — backend trả về, FE gửi lại nguyên vẹn ở lượt sau. */
export interface ConversationContext {
  query: string;
  location?: string | null;
  category?: string | null;
  results?: string[];
  shown?: string[];
}

export interface TourismQuery {
  text: string;
  location?: string;
  category?: string;
  use_vector_search: boolean;
  context?: ConversationContext | null;
  limit?: number;
  generate_answer?: boolean;
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
  // RAG generation + hội thoại
  answer?: string | null;
  answer_source?: string | null;
  effective_query?: string | null;
  context?: ConversationContext | null;
  // câu hỏi gợi ý bấm được (hỏi lại khi trùng tên, "có phải bạn muốn hỏi", không có dữ liệu...)
  suggestions?: string[];
  cached?: boolean;
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
