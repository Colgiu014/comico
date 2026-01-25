'use client';

import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  label: string;
  icon: string;
}

export default function FileUpload({
  onFilesSelected,
  accept = 'image/*',
  label,
  icon,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  }, [onFilesSelected]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(Array.from(e.target.files));
    }
  }, [onFilesSelected]);

  return (
    <motion.div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer ${
        isDragging
          ? 'border-pink-500 bg-pink-500/10 scale-105'
          : 'border-white/30 hover:border-white/50 hover:bg-white/5'
      }`}
    >
      <input
        type="file"
        multiple
        accept={accept}
        onChange={handleFileSelect}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      
      <div className="text-center py-8">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{label}</h3>
        <p className="text-white/60">Drag and drop or click to select files</p>
      </div>
    </motion.div>
  );
}
