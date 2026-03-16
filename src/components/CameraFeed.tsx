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
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('Camera access denied or not available');
      setCameraActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
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

    return () => {
      stopCamera();
    };
  }, [isRunning, startCamera, stopCamera]);

  useEffect(() => {
    const video = videoRef.current;
    const stream = streamRef.current;

    if (!video || !stream || !cameraActive) return;

    video.srcObject = stream;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (err) {
        console.error('Video playback error:', err);
        setCameraError('Unable to display the camera preview');
        setCameraActive(false);
      }
    };

    playVideo();
  }, [cameraActive]);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !onFrameCapture) return;

    const video = videoRef.current;
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) return;

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg', 0.8);
    onFrameCapture(base64);
  }, [onFrameCapture]);

  useEffect(() => {
    if (!isRunning || !cameraActive || isProcessing) return;

    const interval = window.setInterval(() => {
      captureFrame();
    }, 6000);

    return () => window.clearInterval(interval);
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
          <canvas ref={canvasRef} className="hidden" />
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 h-full w-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
          />

          {!cameraActive && (
            <div className="flex h-full items-center justify-center text-slate-400">
              <div className="text-center">
                {cameraError ? (
                  <>
                    <VideoOff className="mx-auto mb-4 h-16 w-16 opacity-50" />
                    <p className="text-lg text-red-400">Camera Unavailable</p>
                    <p className="text-sm">{cameraError}</p>
                  </>
                ) : (
                  <>
                    <Camera className="mx-auto mb-4 h-16 w-16 opacity-50" />
                    <p className="text-lg">Camera Offline</p>
                    <p className="text-sm">Start the system to activate camera feed</p>
                  </>
                )}
              </div>
            </div>
          )}

          {cameraActive && (
            <>
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20">
                  <div className="animate-pulse text-lg font-semibold text-white">
                    Analyzing Object...
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <Button
                  onClick={captureFrame}
                  disabled={isProcessing}
                  className="bg-green-500 hover:bg-green-600 text-white"
                  size="sm"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Capture & Classify
                </Button>
              </div>

              <div className="absolute left-4 top-4 text-sm font-mono text-green-400">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  REC
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraFeed;
