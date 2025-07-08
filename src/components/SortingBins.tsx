
import React, { useEffect, useState } from 'react';
import { Trash2, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WasteItem } from './WasteSortingSystem';

interface SortingBinsProps {
  currentItem: WasteItem | null;
  sortingHistory: WasteItem[];
}

const SortingBins: React.FC<SortingBinsProps> = ({ currentItem, sortingHistory }) => {
  const [activeSort, setActiveSort] = useState<string | null>(null);

  useEffect(() => {
    if (currentItem) {
      setActiveSort(currentItem.category);
      setTimeout(() => setActiveSort(null), 2000);
    }
  }, [currentItem]);

  const bins = [
    { 
      category: 'plastic', 
      name: 'Plastic', 
      color: 'bg-blue-500', 
      icon: '♻️',
      description: 'Bottles, containers, bags'
    },
    { 
      category: 'paper', 
      name: 'Paper', 
      color: 'bg-amber-500', 
      icon: '📄',
      description: 'Newspapers, cardboard, documents'
    },
    { 
      category: 'metal', 
      name: 'Metal', 
      color: 'bg-gray-500', 
      icon: '🔩',
      description: 'Cans, foil, metal objects'
    },
    { 
      category: 'organic', 
      name: 'Organic', 
      color: 'bg-green-500', 
      icon: '🍃',
      description: 'Food waste, biodegradable items'
    }
  ];

  const getBinCount = (category: string) => {
    return sortingHistory.filter(item => item.category === category).length;
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-green-400" />
          Automated Sorting Bins
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bins.map((bin) => {
            const isActive = activeSort === bin.category;
            const count = getBinCount(bin.category);
            
            return (
              <div key={bin.category} className="relative">
                {/* Sorting Animation */}
                {isActive && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="animate-bounce">
                      <ArrowDown className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
                
                <div className={`
                  relative p-6 rounded-lg border-2 transition-all duration-300
                  ${isActive 
                    ? `${bin.color} border-white shadow-lg scale-105` 
                    : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                  }
                `}>
                  {/* Bin Icon */}
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{bin.icon}</div>
                    <h3 className={`font-semibold text-lg ${isActive ? 'text-white' : 'text-slate-200'}`}>
                      {bin.name}
                    </h3>
                    <p className={`text-sm ${isActive ? 'text-slate-100' : 'text-slate-400'}`}>
                      {bin.description}
                    </p>
                  </div>

                  {/* Count Display */}
                  <div className="text-center">
                    <div className={`
                      inline-flex items-center justify-center w-12 h-12 rounded-full 
                      ${isActive ? 'bg-white/20' : 'bg-slate-600'}
                      transition-colors duration-300
                    `}>
                      <span className={`font-bold text-lg ${isActive ? 'text-white' : 'text-slate-200'}`}>
                        {count}
                      </span>
                    </div>
                    <p className={`text-sm mt-2 ${isActive ? 'text-slate-100' : 'text-slate-400'}`}>
                      Items sorted
                    </p>
                  </div>

                  {/* Active sorting indicator */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg border-2 border-white animate-pulse" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        {sortingHistory.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-600">
            <h4 className="text-white font-semibold mb-4">Recent Sorting Activity</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {sortingHistory.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.category === 'plastic' ? '♻️' : item.category === 'paper' ? '📄' : item.category === 'metal' ? '🔩' : '🍃'}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{item.name}</p>
                      <p className="text-slate-400 text-xs">
                        {item.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 text-sm font-semibold">
                      {(item.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SortingBins;
