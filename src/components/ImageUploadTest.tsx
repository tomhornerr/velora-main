"use client";

import * as React from "react";
import { useState } from "react";
import { ImageUploadFeature } from './ImageUploadFeature';
import { ImageUploadButton } from './ImageUploadButton';

export const ImageUploadTest = () => {
  const [showModal, setShowModal] = useState(false);
  const [lastQuery, setLastQuery] = useState<string>("");

  const handleImageProcessed = (query: string) => {
    setLastQuery(query);
    console.log('Generated search query:', query);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Property Screenshot Analysis Test
        </h1>
        <p className="text-slate-600">
          Test the image upload feature for property analysis
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        {/* Method 1: Direct Modal */}
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open Image Upload Modal
        </button>

        {/* Method 2: Button Component */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-600">Or use button:</span>
          <ImageUploadButton
            onImageUpload={handleImageProcessed}
            size="lg"
          />
        </div>
      </div>

      {lastQuery && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-2">Last Generated Query:</h3>
          <p className="text-green-800">{lastQuery}</p>
        </div>
      )}

      <div className="bg-slate-50 rounded-lg p-4">
        <h3 className="font-medium text-slate-900 mb-2">How to Test:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700">
          <li>Click either button above</li>
          <li>Upload any image (property screenshot or any image for testing)</li>
          <li>Wait for the mock processing to complete</li>
          <li>Review the extracted text and generated search query</li>
          <li>Click "Use This Search" to see the query in the console</li>
        </ol>
      </div>

      {/* Modal */}
      <ImageUploadFeature
        isVisible={showModal}
        onImageProcessed={handleImageProcessed}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default ImageUploadTest;
