import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Check, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';

interface CameraAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAvatar: (photoURL: string) => void;
}

export const CameraAvatarModal: React.FC<CameraAvatarModalProps> = ({
  isOpen,
  onClose,
  onSaveAvatar,
}) => {
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, mode]);

  const startCamera = async () => {
    setErrorMsg(null);
    setCapturedImage(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 400, height: 400, facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      setErrorMsg('Camera access denied or unavailable. Please use file upload instead.');
      setMode('upload');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 300;
    canvas.height = video.videoHeight || 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCapturedImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">Update Profile Avatar</h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode('camera')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mode === 'camera' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>
          <button
            onClick={() => setMode('upload')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mode === 'upload' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-amber-950/60 border border-amber-800/80 rounded-xl text-xs text-amber-300">
            {errorMsg}
          </div>
        )}

        {/* Camera or Upload Area */}
        <div className="relative aspect-square bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
          {capturedImage ? (
            <img src={capturedImage} alt="Avatar preview" className="w-full h-full object-cover" />
          ) : mode === 'camera' ? (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-6 text-center hover:bg-slate-900 transition">
              <ImageIcon className="w-12 h-12 text-slate-600 mb-2" />
              <span className="text-xs font-bold text-slate-300">Click to browse image file</span>
              <span className="text-[10px] text-slate-500 mt-1">PNG, JPG or WEBP up to 5MB</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {capturedImage ? (
            <>
              <button
                onClick={() => {
                  setCapturedImage(null);
                  if (mode === 'camera') startCamera();
                }}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake</span>
              </button>
              <button
                onClick={() => {
                  onSaveAvatar(capturedImage);
                  stopCamera();
                  onClose();
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <Check className="w-4 h-4" />
                <span>Save Avatar</span>
              </button>
            </>
          ) : mode === 'camera' ? (
            <button
              onClick={handleCapture}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Photo</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
