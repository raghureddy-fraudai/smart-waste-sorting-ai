import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Zap, Recycle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import CameraFeed from './CameraFeed';
import SortingBins from './SortingBins';
import StatsPanel from './StatsPanel';
import ClassificationResults from './ClassificationResults';
import PhotoUpload from './PhotoUpload';

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
    accuracy: 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const classifyWithAI = async (imageBase64: string, imageUrl?: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setProcessingProgress(20);

    try {
      setProcessingProgress(50);

      const { data, error } = await supabase.functions.invoke('classify-waste', {
        body: { imageBase64 },
      });

      if (error) {
        throw new Error(error.message || 'Classification failed');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setProcessingProgress(90);

      const newItem: WasteItem = {
        id: Date.now().toString(),
        name: data.name || 'Unknown Item',
        category: data.category || 'organic',
        confidence: data.confidence || 0.7,
        timestamp: new Date(),
        image: imageUrl,
      };

      setCurrentItem(newItem);
      setSortingHistory((prev) => [newItem, ...prev.slice(0, 9)]);
      setStats((prev) => ({
        ...prev,
        [newItem.category]: prev[newItem.category] + 1,
        total: prev.total + 1,
        accuracy: prev.total === 0 ? newItem.confidence * 100 : 
          ((prev.accuracy * prev.total) + (newItem.confidence * 100)) / (prev.total + 1),
      }));
      setProcessingProgress(100);

      toast.success(`Classified: ${newItem.name} → ${newItem.category}`, {
        description: `Confidence: ${(newItem.confidence * 100).toFixed(1)}%`,
      });

      setTimeout(() => {
        setCurrentItem(null);
      }, 4000);
    } catch (err) {
      console.error('Classification error:', err);
      toast.error('Classification failed', {
        description: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const handleFrameCapture = (base64: string) => {
    classifyWithAI(base64);
  };

  const processUploadedImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      classifyWithAI(base64, URL.createObjectURL(file));
    };
    reader.readAsDataURL(file);
  };

  const toggleSystem = () => {
    setIsRunning(!isRunning);
  };

  const resetSystem = () => {
    setIsRunning(false);
    setCurrentItem(null);
    setSortingHistory([]);
    setStats({ plastic: 0, paper: 0, metal: 0, organic: 0, total: 0, accuracy: 0 });
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
            AI-powered waste classification using real-time camera detection and deep learning
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
                <Badge variant={isRunning ? 'default' : 'secondary'} className="text-sm">
                  {isRunning ? 'Active' : 'Inactive'}
                </Badge>
                {isProcessing && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300">Classifying...</span>
                    <Progress value={processingProgress} className="w-24" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CameraFeed
              isRunning={isRunning}
              isProcessing={isProcessing}
              onFrameCapture={handleFrameCapture}
            />
            <PhotoUpload onImageUpload={processUploadedImage} isProcessing={isProcessing} />
            <ClassificationResults currentItem={currentItem} isProcessing={isProcessing} />
          </div>
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
