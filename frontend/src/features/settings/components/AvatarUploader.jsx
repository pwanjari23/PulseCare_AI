/**
 * PulseCare AI - AvatarUploader Component
 */

import React, { useState } from 'react';
import { Camera, Upload, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const AvatarUploader = ({ avatarUrl, onUpload, isUploading = false, className = '' }) => {
  const [preview, setPreview] = useState(avatarUrl || null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPG, PNG, WebP).');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const formData = new FormData();
    formData.append('avatar', file);
    onUpload?.(formData);
  };

  return (
    <div className={`flex items-center space-x-5 font-sans ${className}`}>
      <div className="relative group w-20 h-20 rounded-3xl bg-primary/10 border-2 border-dashed border-primary/40 flex items-center justify-center overflow-hidden shrink-0">
        {preview ? (
          <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover rounded-3xl" />
        ) : (
          <Camera className="w-8 h-8 text-primary/60" />
        )}

        <label
          htmlFor="avatar-input"
          className="absolute inset-0 bg-background/80 backdrop-blur-2xs opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-xs font-bold text-foreground"
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          ) : (
            <>
              <Upload className="w-4 h-4 mb-0.5 text-primary" />
              <span className="text-[10px]">Change</span>
            </>
          )}
        </label>
        <input
          id="avatar-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-bold text-foreground">Profile Photo</h4>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          PNG, JPG, or WebP up to 5MB. Photo will be displayed across consultations & clinical reports.
        </p>
      </div>
    </div>
  );
};

export default AvatarUploader;
