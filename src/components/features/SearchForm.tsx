import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input, Textarea, Button } from '@/components/ui';
import { Search, MapPin, Filter, Mic, Sparkles } from 'lucide-react';
import { TourismQuery } from '@/types/tourism';

interface SearchFormProps {
  onSearch: (query: TourismQuery) => void;
  isLoading?: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading = false }) => {
  const [formData, setFormData] = useState<TourismQuery>({
    text: '',
    location: '',
    category: '',
    use_vector_search: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.text.trim()) {
      onSearch({
        ...formData,
        // Only include location and category if they have values
        location: formData.location?.trim() || undefined,
        category: formData.category?.trim() || undefined,
      });
    }
  };

  const handleInputChange = (field: keyof TourismQuery, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Ward administrative questions and detailed tourism suggestions
  const adminQueries = [
    'Phường Trấn Biên được gộp từ những phường nào?',
    'Phường Tân Triều có bao nhiêu xã phường?',
    'Xã Thạnh Phú mới tên là gì?',
  ];

  const tourismSuggestions = [
    {
      category: '🏛️ Di tích lịch sử',
      queries: [
        'Nhà thờ cổ kính ở Biên Hòa',
        'Địa đạo Củ Chi gần Đồng Nai',
        'Đền thờ và miếu mạo truyền thống',
      ]
    },
    {
      category: '🌳 Sinh thái & Thiên nhiên',
      queries: [
        'Khu du lịch sinh thái rừng tre',
        'Thác nước đẹp ở Đồng Nai',
        'Vườn trái cây miệt vườn',
      ]
    },
    {
      category: '🍜 Ẩm thực & Văn hóa',
      queries: [
        'Chợ truyền thống ở Xuân Lộc',
        'Làng nghề thủ công mỹ nghệ',
        'Quán cà phê view đẹp Biên Hòa',
      ]
    },
  ];

  return (
    <Card className="result-card border-0 shadow-vietnam">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl vietnamese-text">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl">
            <Search className="h-6 w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">
            Tìm kiếm du lịch thông minh
          </span>
          <Sparkles className="h-5 w-5 text-yellow-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main search query */}
          <Textarea
            label="Search Query"
            placeholder="Nhập câu hỏi về địa điểm du lịch..."
            value={formData.text}
            onChange={(e) => handleInputChange('text', e.target.value)}
            rows={3}
            helperText="Ví dụ: 'Tìm địa điểm du lịch ở Đồng Nai' hoặc 'Nhà thờ cổ kính Sài Gòn'"
          />

          {/* Optional filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Location Filter (Optional)"
              placeholder="Ví dụ: Đồng Nai, Sài Gòn..."
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              helperText="Lọc theo tỉnh/thành phố"
            />

            <Input
              label="Category Filter (Optional)"
              placeholder="Ví dụ: nhà thờ, bãi biển..."
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              helperText="Lọc theo loại hình du lịch"
            />
          </div>

          {/* Search options */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Filter className="h-4 w-4 text-gray-600" />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.use_vector_search}
                onChange={(e) => handleInputChange('use_vector_search', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Enable Vector Search (Semantic Understanding)
            </label>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={!formData.text.trim() || isLoading}
            className="w-full"
          >
            <Search className="h-4 w-4 mr-2" />
            Search Tourism Locations
          </Button>
        </form>

        {/* Administrative Questions & Tourism Suggestions */}
        <div className="mt-6 border-t pt-4 space-y-4">
          {/* Administrative Ward Questions */}
          <div>
            <h4 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
              <span>📋</span> Câu hỏi về hành chính phường xã:
            </h4>
            <div className="space-y-1.5">
              {adminQueries.map((query, index) => (
                <button
                  key={`admin-${index}`}
                  onClick={() => setFormData(prev => ({ ...prev, text: query }))}
                  className="block w-full text-left text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-2 rounded transition-colors border border-purple-100"
                >
                  "{query}"
                </button>
              ))}
            </div>
          </div>

          {/* Tourism Suggestions by Category */}
          <div>
            <h4 className="text-sm font-semibold text-green-700 mb-3">
              Gợi ý du lịch:
            </h4>
            <div className="space-y-3">
              {tourismSuggestions.map((category, catIndex) => (
                <div key={`cat-${catIndex}`} className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">{category.category}</h5>
                  <div className="space-y-1">
                    {category.queries.map((query, qIndex) => (
                      <button
                        key={`q-${catIndex}-${qIndex}`}
                        onClick={() => setFormData(prev => ({ ...prev, text: query }))}
                        className="block w-full text-left text-xs text-green-600 hover:text-green-800 hover:bg-white p-1.5 rounded transition-colors"
                      >
                        • {query}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
