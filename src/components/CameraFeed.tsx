import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Wifi, WifiOff, VideoOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CameraFeedProps {
  isRunning: boolean;
  isProcessing: boolean;
  onFrameCapture?: (base64: string) => void;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ isRunning, isProcessing, onFrameCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('Camera access denied or not available');
      setCameraActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    if (isRunning) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isRunning, startCamera, stopCamera]);

  // Capture a frame and send to parent for AI classification
  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !onFrameCapture) return;
    const video = videoRef.current;
    // Don't capture if video isn't ready or has no dimensions
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) return;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg', 0.8);
    onFrameCapture(base64);
  }, [onFrameCapture]);

  // Auto-capture every 6 seconds when running and not processing
  useEffect(() => {
    if (!isRunning || !cameraActive || isProcessing) return;
    const interval = setInterval(() => {
      captureFrame();
    }, 6000);
    return () => clearInterval(interval);
  }, [isRunning, cameraActive, isProcessing, captureFrame]);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-400" />
            Live Camera Feed
          </CardTitle>
          <div className="flex items-center gap-2">
            {cameraActive ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <Badge variant={cameraActive ? 'default' : 'secondary'}>
              {cameraActive ? 'Live' : 'Offline'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-600">
          {/* Hidden canvas for frame capture */}
          <canvas ref={canvasRef} className="hidden" />

          {cameraActive ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Processing overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                  <div className="text-white text-lg font-semibold animate-pulse">
                    Analyzing Object...
                  </div>
                </div>
              )}

              {/* Manual capture button */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <Button
                  onClick={captureFrame}
                  disabled={isProcessing}
                  className="bg-green-500 hover:bg-green-600 text-white"
                  size="sm"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Capture & Classify
                </Button>
              </div>

              {/* Camera info overlay */}
              <div className="absolute top-4 left-4 text-green-400 text-sm font-mono">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  REC
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                {cameraError ? (
                  <>
                    <VideoOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg text-red-400">Camera Unavailable</p>
                    <p className="text-sm">{cameraError}</p>
                  </>
                ) : (
                  <>
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Camera Offline</p>
                    <p className="text-sm">Start the system to activate camera feed</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraFeed;
