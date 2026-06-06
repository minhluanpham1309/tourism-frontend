'use client';

import { IntentInfo } from '@/types/tourism';
import { Card } from '@/components/ui/Card';

interface IntentDisplayProps {
  intentInfo: IntentInfo;
}

export function IntentDisplay({ intentInfo }: IntentDisplayProps) {
  const getIntentIcon = (intent: string) => {
    if (intent.includes('tourist') || intent.includes('recommend')) {
      return '🏞️';
    }
    return '🏛️';
  };

  const getIntentCategory = (intent: string) => {
    if (intent.includes('tourist') || intent.includes('recommend')) {
      return 'Tourism';
    }
    return 'Administrative';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'text-green-600';
    if (confidence >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMethodBadge = (method: string) => {
    if (method === 'phobert_transformers') {
      return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">PhoBERT</span>;
    }
    return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Keyword</span>;
  };

  return (
    <Card className="mb-4 border-l-4 border-l-blue-500">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getIntentIcon(intentInfo.predicted_intent)}</span>
            <span className="font-semibold text-gray-700">
              Intent Classification
            </span>
            {getMethodBadge(intentInfo.method)}
          </div>
          <span className={`font-bold ${getConfidenceColor(intentInfo.confidence)}`}>
            {(intentInfo.confidence * 100).toFixed(1)}%
          </span>
        </div>
        
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-gray-600">Category: </span>
            <span className="text-sm text-gray-800">
              {getIntentCategory(intentInfo.predicted_intent)}
            </span>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-600">Intent: </span>
            <span className="text-sm text-gray-800 font-mono">
              {intentInfo.predicted_intent}
            </span>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-600">Description: </span>
            <span className="text-sm text-gray-800">
              {intentInfo.description}
            </span>
          </div>

          {intentInfo.confidence < 0.5 && intentInfo.all_probabilities && (
            <div className="mt-3 p-2 bg-yellow-50 rounded">
              <div className="text-xs font-medium text-yellow-800 mb-1">
                Low confidence - Top alternatives:
              </div>
              <div className="space-y-1">
                {Object.entries(intentInfo.all_probabilities)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3)
                  .map(([intent, prob]) => (
                    <div key={intent} className="flex justify-between text-xs">
                      <span className="text-yellow-700">{intent}</span>
                      <span className="text-yellow-800 font-mono">
                        {(prob * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
