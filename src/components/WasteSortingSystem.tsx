
import React, { useState, useEffect, useRef } from 'react';
import { Camera, Play, Pause, RotateCcw, Zap, Recycle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import CameraFeed from './CameraFeed';
import SortingBins from './SortingBins';
import StatsPanel from './StatsPanel';
import ClassificationResults from './ClassificationResults';

export interface WasteItem {
  id: string;
  name: string;
  category: 'plastic' | 'paper' | 'metal' | 'organic';
  confidence: number;
  timestamp: Date;
  image?: string;
}

export interface SortingStats {
  plastic: number;
  paper: number;
  metal: number;
  organic: number;
  total: number;
  accuracy: number;
}

const WasteSortingSystem = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentItem, setCurrentItem] = useState<WasteItem | null>(null);
  const [sortingHistory, setSortingHistory] = useState<WasteItem[]>([]);
  const [stats, setStats] = useState<SortingStats>({
    plastic: 0,
    paper: 0,
    metal: 0,
    organic: 0,
    total: 0,
    accuracy: 95.8
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Simulate waste items for demonstration
  const wasteItems = [
    { name: 'Plastic Bottle', category: 'plastic' as const, confidence: 0.96 },
    { name: 'Newspaper', category: 'paper' as const, confidence: 0.93 },
    { name: 'Aluminum Can', category: 'metal' as const, confidence: 0.98 },
    { name: 'Apple Core', category: 'organic' as const, confidence: 0.91 },
    { name: 'Cardboard Box', category: 'paper' as const, confidence: 0.94 },
    { name: 'Plastic Bag', category: 'plastic' as const, confidence: 0.89 },
    { name: 'Tin Can', category: 'metal' as const, confidence: 0.97 },
    { name: 'Banana Peel', category: 'organic' as const, confidence: 0.92 }
  ];

  const processNewItem = () => {
    if (!isRunning) return;

    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate processing time with progress
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          
          // Select random waste item
          const randomItem = wasteItems[Math.floor(Math.random() * wasteItems.length)];
          const newItem: WasteItem = {
            id: Date.now().toString(),
            ...randomItem,
            timestamp: new Date()
          };

          setCurrentItem(newItem);
          setSortingHistory(prev => [newItem, ...prev.slice(0, 9)]);
          setStats(prev => ({
            ...prev,
            [newItem.category]: prev[newItem.category] + 1,
            total: prev.total + 1
          }));

          setTimeout(() => {
            setIsProcessing(false);
            setCurrentItem(null);
          }, 3000);

          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(processNewItem, 5000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleSystem = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      processNewItem();
    }
  };

  const resetSystem = () => {
    setIsRunning(false);
    setCurrentItem(null);
    setSortingHistory([]);
    setStats({
      plastic: 0,
      paper: 0,
      metal: 0,
      organic: 0,
      total: 0,
      accuracy: 95.8
    });
    setIsProcessing(false);
    setProcessingProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-500/20 rounded-full">
              <Recycle className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">Smart Waste Sorting System</h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            AI-powered waste classification and sorting using computer vision and deep learning
          </p>
        </div>

        {/* Control Panel */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              System Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleSystem}
                className={`${
                  isRunning 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Stop System
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start System
                  </>
                )}
              </Button>
              
              <Button
                onClick={resetSystem}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>

              <div className="flex items-center gap-2 ml-auto">
                <Badge variant={isRunning ? "default" : "secondary"} className="text-sm">
                  {isRunning ? 'Active' : 'Inactive'}
                </Badge>
                {isProcessing && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300">Processing...</span>
                    <Progress value={processingProgress} className="w-24" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Camera and Classification */}
          <div className="lg:col-span-2 space-y-6">
            <CameraFeed isRunning={isRunning} isProcessing={isProcessing} />
            <ClassificationResults currentItem={currentItem} isProcessing={isProcessing} />
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            <StatsPanel stats={stats} />
          </div>
        </div>

        {/* Sorting Bins */}
        <SortingBins currentItem={currentItem} sortingHistory={sortingHistory} />
      </div>
    </div>
  );
};

export default WasteSortingSystem;
