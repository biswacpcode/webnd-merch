"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Image, X } from "lucide-react";

interface ImageUploadProps {
  onChange: (file: File | null) => void;   // Callback for parent to get the file
  preview: string | null;                   // URL preview
}

const ImageUpload = ({ onChange, preview }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag over event
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle drag leave event
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Handle file drop event
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onChange(file);
    }
  };

  // Handle file selection via file input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onChange(file);
    }
  };

  // Trigger file input click
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Remove selected image
  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        // Drag & Drop Area
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
            isDragging 
              ? "border-gray-500 bg-purple-100" 
              : "border-gray-300 hover:border-gray-500 hover:bg-gray-50"
          }`}
        >
          <div className="flex flex-col items-center">
            <Image className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop an image, or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Supports: JPG, PNG, GIF (Max 5MB)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>
      ) : (
        // Image Preview
        <div className="relative rounded-lg overflow-hidden group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto max-h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full hover:bg-black/90 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
