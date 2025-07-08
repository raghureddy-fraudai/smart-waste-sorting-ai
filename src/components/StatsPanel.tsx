
import React from 'react';
import { BarChart3, TrendingUp, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SortingStats } from './WasteSortingSystem';

interface StatsPanelProps {
  stats: SortingStats;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const categories = [
    { name: 'Plastic', value: stats.plastic, color: 'bg-blue-500', icon: '♻️' },
    { name: 'Paper', value: stats.paper, color: 'bg-amber-500', icon: '📄' },
    { name: 'Metal', value: stats.metal, color: 'bg-gray-500', icon: '🔩' },
    { name: 'Organic', value: stats.organic, color: 'bg-green-500', icon: '🍃' }
  ];

  const getPercentage = (value: number) => {
    return stats.total > 0 ? (value / stats.total) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            System Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-slate-400 text-sm">Total Items</div>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{stats.accuracy}%</div>
              <div className="text-slate-400 text-sm">Accuracy</div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold flex items-center gap-2">
              <Target className="w-4 h-4" />
              Category Distribution
            </h4>
            {categories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-slate-300 text-sm">{category.name}</span>
                  </div>
                  <div className="text-white font-semibold">
                    {category.value} ({getPercentage(category.value).toFixed(1)}%)
                  </div>
                </div>
                <Progress 
                  value={getPercentage(category.value)} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-300">Processing Speed</span>
              <span className="text-white font-semibold">1.2s avg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Throughput</span>
              <span className="text-white font-semibold">12 items/min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Uptime</span>
              <span className="text-green-400 font-semibold">99.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Error Rate</span>
              <span className="text-red-400 font-semibold">0.8%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">CPU Usage</span>
              <div className="flex items-center gap-2">
                <Progress value={65} className="w-16 h-2" />
                <span className="text-white text-sm">65%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Memory</span>
              <div className="flex items-center gap-2">
                <Progress value={42} className="w-16 h-2" />
                <span className="text-white text-sm">42%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">GPU Load</span>
              <div className="flex items-center gap-2">
                <Progress value={78} className="w-16 h-2" />
                <span className="text-white text-sm">78%</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Temperature</span>
              <span className="text-white font-semibold">68°C</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPanel;
