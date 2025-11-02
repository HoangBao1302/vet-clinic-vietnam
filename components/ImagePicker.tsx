"use client";

import { useState } from "react";
import { FolderOpen, Upload, X, Check } from "lucide-react";

interface ImagePickerProps {
  value: string;
  onChange: (value: string) => void;
  availableImages?: string[];
  label?: string;
}

export default function ImagePicker({
  value,
  onChange,
  availableImages = [],
  label = "Hình ảnh",
}: ImagePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [uploadMode, setUploadMode] = useState<"browse" | "upload">("browse");

  // Available images in public/vet-images
  const defaultImages = [
    "/vet-images/1.png",
    "/vet-images/2.png",
    "/vet-images/3.png",
    "/vet-images/4.png",
    "/vet-images/5.png",
    "/vet-images/6.png",
    "/vet-images/euro1.jpg",
    "/vet-images/gbp1.jpg",
    "/vet-images/jpy1.jpeg",
    "/vet-images/jpy2.jpg",
  ];

  const images = availableImages.length > 0 ? availableImages : defaultImages;

  const handleImageChange = (imagePath: string) => {
    onChange(imagePath);
    setShowPicker(false);
  };

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh (JPG, PNG, GIF)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File ảnh không được vượt quá 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onChange(base64String);
      setShowPicker(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FolderOpen size={14} />
          {showPicker ? "Ẩn" : "Chọn ảnh"}
        </button>
      </div>

      {showPicker && (
        <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setUploadMode("browse")}
              className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
                uploadMode === "browse"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FolderOpen size={18} className="inline mr-2" />
              Chọn từ thư viện
            </button>
            <button
              type="button"
              onClick={() => setUploadMode("upload")}
              className={`flex-1 px-3 py-2 rounded-lg transition-colors ${
                uploadMode === "upload"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Upload size={18} className="inline mr-2" />
              Upload mới
            </button>
          </div>

          {uploadMode === "browse" ? (
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2">
              {images.map((imgPath) => (
                <button
                  key={imgPath}
                  type="button"
                  onClick={() => handleImageChange(imgPath)}
                  className="relative group border-2 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
                >
                  <img
                    src={imgPath}
                    alt=""
                    className="w-full h-20 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-image.png";
                    }}
                  />
                  {value === imgPath && (
                    <div className="absolute inset-0 bg-blue-600 bg-opacity-50 flex items-center justify-center">
                      <Check className="text-white" size={24} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadChange}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm text-gray-600">
                    Click để chọn ảnh hoặc kéo thả vào đây
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, GIF - Tối đa 5MB
                  </p>
                </div>
              </label>
              {value && value.startsWith("data:image/") && (
                <div className="relative inline-block">
                  <img
                    src={value}
                    alt="Upload preview"
                    className="max-w-full h-32 object-contain border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => onChange("")}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {value && (
        <div className="mt-3 relative h-40 rounded-lg overflow-hidden border border-gray-300">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Manual input fallback */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/vet-images/1.png hoặc paste link"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
    </div>
  );
}

