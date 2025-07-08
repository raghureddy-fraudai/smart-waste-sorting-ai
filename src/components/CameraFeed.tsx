
import React, { useEffect, useState } from 'react';
import { Camera, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CameraFeedProps {
  isRunning: boolean;
  isProcessing: boolean;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ isRunning, isProcessing }) => {
  const [feedActive, setFeedActive] = useState(false);

  useEffect(() => {
    setFeedActive(isRunning);
  }, [isRunning]);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-400" />
            Camera Feed
          </CardTitle>
          <div className="flex items-center gap-2">
            {feedActive ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <Badge variant={feedActive ? "default" : "secondary"}>
              {feedActive ? 'Live' : 'Offline'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-600">
          {feedActive ? (
            <div className="relative w-full h-full">
              {/* Simulated camera feed background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
              
              {/* Grid overlay for camera effect */}
              <div className="absolute inset-0 opacity-30">
                <div className="grid grid-cols-12 grid-rows-8 h-full">
                  {Array.from({ length: 96 }).map((_, i) => (
                    <div key={i} className="border border-slate-600/30" />
                  ))}
                </div>
              </div>

              {/* Center crosshair */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-8 h-8 border-2 border-green-400 rounded-full animate-pulse" />
                  <div className="absolute top-1/2 left-1/2 w-16 h-0.5 bg-green-400 -translate-x-1/2 -translate-y-0.5" />
                  <div className="absolute top-1/2 left-1/2 w-0.5 h-16 bg-green-400 -translate-x-0.5 -translate-y-1/2" />
                </div>
              </div>

              {/* Processing overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                  <div className="text-white text-lg font-semibold animate-pulse">
                    Analyzing Object...
                  </div>
                </div>
              )}

              {/* Camera info overlay */}
              <div className="absolute top-4 left-4 text-green-400 text-sm font-mono">
                <div>RES: 1920x1080</div>
                <div>FPS: 30</div>
                <div>ISO: 400</div>
              </div>

              {/* Timestamp */}
              <div className="absolute bottom-4 right-4 text-white text-sm font-mono">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Camera Offline</p>
                <p className="text-sm">Start the system to activate camera feed</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraFeed;
