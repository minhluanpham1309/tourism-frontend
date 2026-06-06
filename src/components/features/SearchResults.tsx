import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Alert } from '@/components/ui';
import { SearchResponse } from '@/types/tourism';
import { MapPin, Clock, Database, Zap, Star, Navigation, Search } from 'lucide-react';
import { IntentDisplay } from './IntentDisplay';

interface SearchResultsProps {
  results: SearchResponse | null;
  isLoading?: boolean;
  error?: string | null;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading = false,
  error = null,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Searching tourism locations...</p>
            <p className="text-sm text-gray-500 mt-1">This may take a few seconds</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert type="error" title="Search Error">
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Enter a search query to find tourism locations</p>
            <p className="text-sm mt-1">Use natural language in Vietnamese or English</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { query, results: locations, total, processing_time, search_method, intent_info } = results;

  return (
    <div className="space-y-6">
      {/* Intent Classification */}
      {intent_info && <IntentDisplay intentInfo={intent_info} />}

      {/* Search Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Search Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-blue-500" />
                <strong>{total}</strong> locations found
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-green-500" />
                {(processing_time * 1000).toFixed(0)}ms
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-purple-500" />
                {search_method}
              </span>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Query:</strong> "{query}"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results List */}
      {locations.length === 0 ? (
        <Card>
          <CardContent>
            <Alert type="info" title="No Results Found">
              No tourism locations match your search criteria. Try:
              <ul className="mt-2 ml-4 list-disc text-sm">
                <li>Using different keywords</li>
                <li>Removing location or category filters</li>
                <li>Trying a more general search term</li>
              </ul>
            </Alert>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {locations.map((location, index) => {
            // Check if this is an administrative result
            const isAdminResult = location.source.includes('administrative');
            const isSubUnit = location.source.includes('subunit');
            const isSummary = location.source.includes('summary');
            const isOldWard = location.source.includes('old_ward');
            const isAdminTourism = location.source.includes('administrative_tourism');
            const isAdminTourismSummary = location.source.includes('tourism_summary');

            // Determine indentation
            let indentClass = '';
            if (isSubUnit || isOldWard) indentClass = 'ml-3';
            else if (isAdminTourism || isAdminTourismSummary) indentClass = 'ml-6';

            // Determine border color
            let borderClass = '';
            if (isOldWard) borderClass = 'border-l-4 border-l-purple-300 bg-purple-50';
            else if (isAdminTourism && !isAdminTourismSummary) borderClass = 'border-l-4 border-l-green-400 bg-green-50';
            else if (isAdminResult) borderClass = 'border-l-4 border-l-purple-500';

            return (
              <Card
                key={index}
                className={`hover:shadow-lg transition-shadow ${indentClass} ${borderClass} ${isSummary || isAdminTourismSummary ? 'bg-gray-50' : ''}`}
              >
                <CardContent className={`${isSubUnit || isSummary || isOldWard || isAdminTourism ? 'p-4' : 'p-6'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className={`${isSubUnit || isOldWard || isAdminTourism ? 'text-base' : 'text-lg'} font-semibold ${isAdminTourism ? 'text-green-900' :
                          isOldWard ? 'text-purple-800' :
                            isAdminResult ? 'text-purple-900' : 'text-gray-900'
                        } mb-2`}>
                        {location.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        {location.ward && !isOldWard && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {location.ward}{location.province && `, ${location.province}`}
                          </span>
                        )}

                        {location.lat && location.lng && (
                          <span className="flex items-center gap-1">
                            <Navigation className="h-4 w-4" />
                            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${isAdminTourism ? 'bg-green-100 text-green-800' :
                          isOldWard ? 'bg-purple-100 text-purple-700' :
                            isAdminResult ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        <Star className="h-3 w-3" />
                        {(location.confidence * 100).toFixed(0)}%
                      </div>

                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {isAdminTourism ? '🏛️ Tourism' : isOldWard ? '📋 Old Ward' : isAdminResult ? '📋 Administrative' : location.source.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons - only for tourism locations */}
                  {!isSubUnit && !isSummary && !isOldWard && !isAdminTourismSummary && (
                    <div className="flex gap-2 pt-3 border-t">
                      {location.lat && location.lng && (
                        <button
                          onClick={() => {
                            const url = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
                            window.open(url, '_blank');
                          }}
                          className={`flex items-center gap-1 px-3 py-1 text-sm rounded transition-colors ${isAdminTourism ? 'text-green-600 hover:text-green-800 hover:bg-green-50' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                            }`}
                        >
                          <MapPin className="h-4 w-4" />
                          View on Map
                        </button>
                      )}

                      <button
                        onClick={() => {
                          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(location.name + ' ' + location.province)}`;
                          window.open(searchUrl, '_blank');
                        }}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                      >
                        <Database className="h-4 w-4" />
                        More Info
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

