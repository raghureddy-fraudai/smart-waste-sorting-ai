
import React from 'react';
import { Brain, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { WasteItem } from './WasteSortingSystem';

interface ClassificationResultsProps {
  currentItem: WasteItem | null;
  isProcessing: boolean;
}

const ClassificationResults: React.FC<ClassificationResultsProps> = ({
  currentItem,
  isProcessing
}) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'plastic': return 'bg-blue-500';
      case 'paper': return 'bg-amber-500';
      case 'metal': return 'bg-gray-500';
      case 'organic': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'plastic': return '♻️';
      case 'paper': return '📄';
      case 'metal': return '🔩';
      case 'organic': return '🍃';
      default: return '❓';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          AI Classification Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isProcessing ? (
          <div className="text-center space-y-4">
            <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto" />
            <p className="text-slate-300">Deep learning model processing...</p>
          </div>
        ) : currentItem ? (
          <div className="space-y-4">
            {/* Display uploaded image if available */}
            {currentItem.image && (
              <div className="text-center">
                <img 
                  src={currentItem.image} 
                  alt={currentItem.name}
                  className="max-w-full max-h-32 mx-auto rounded-lg object-contain bg-slate-700/30 p-2"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{getCategoryIcon(currentItem.category)}</div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{currentItem.name}</h3>
                  <Badge className={`${getCategoryColor(currentItem.category)} text-white capitalize`}>
                    {currentItem.category}
                  </Badge>
                </div>
              </div>
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Confidence Level</span>
                <span className="text-white font-semibold">
                  {(currentItem.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={currentItem.confidence * 100} 
                className="h-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-600">
              <div>
                <p className="text-slate-400 text-sm">Processing Time</p>
                <p className="text-white font-semibold">1.2s</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Model Version</p>
                <p className="text-white font-semibold">v2.1.0</p>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-slate-300 text-sm mb-2">Neural Network Layers Active:</p>
              <div className="flex gap-1">
                {['Conv2D', 'MaxPool', 'Dropout', 'Dense', 'Softmax'].map((layer, i) => (
                  <Badge key={layer} variant="outline" className="text-xs border-slate-500">
                    {layer}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 py-8">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Waiting for waste item detection...</p>
            <p className="text-sm mt-2">Use camera feed or upload a photo</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassificationResults;
