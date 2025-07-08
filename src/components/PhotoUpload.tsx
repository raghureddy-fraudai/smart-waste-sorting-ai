
import React, { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PhotoUploadProps {
  onImageUpload: (file: File) => void;
  isProcessing: boolean;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onImageUpload, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageUpload(file);
  };

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-400" />
          Upload Waste Item Photo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragActive 
              ? 'border-blue-400 bg-blue-400/10' 
              : 'border-slate-600 hover:border-slate-500'
            }
            ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {previewUrl ? (
            <div className="space-y-4">
              <img 
                src={previewUrl} 
                alt="Uploaded waste item" 
                className="max-w-full max-h-48 mx-auto rounded-lg object-contain"
              />
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={clearPreview}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  disabled={isProcessing}
                >
                  Clear
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <ImageIcon className="w-12 h-12 mx-auto text-slate-400" />
              <div>
                <p className="text-slate-300 text-lg mb-2">
                  Drop an image here or click to upload
                </p>
                <p className="text-slate-400 text-sm">
                  Support for JPG, PNG, and WEBP formats
                </p>
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="photo-upload"
                disabled={isProcessing}
              />
              <Button
                onClick={() => document.getElementById('photo-upload')?.click()}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isProcessing}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoUpload;
