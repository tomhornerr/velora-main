# Property Screenshot Analysis Feature

## Overview
This feature allows users to upload screenshots of property listings (from Rightmove, Zoopla, etc.) and automatically extract property details to generate search queries. This makes finding comparable properties much faster and more efficient.

## Components

### 1. `ImageUploadFeature.tsx`
The main modal component that handles:
- Drag & drop image upload
- OCR text extraction (currently mocked)
- AI-powered search query generation
- User interface for reviewing extracted data

### 2. `ImageUploadButton.tsx`
A simple button component that:
- Opens the image upload modal
- Can be easily integrated into existing search bars
- Handles the image processing workflow

### 3. `SearchBarWithImageUpload.tsx`
Example integration showing how to add the image upload feature to existing search bars.

## Current Implementation Status

### ✅ Completed
- Complete UI/UX design
- Drag & drop functionality
- Image preview and processing flow
- Mock OCR text extraction
- Mock AI search query generation
- Responsive design with animations
- Easy integration pattern

### 🔄 Mock Implementation
The current implementation uses mock data for:
- **OCR Processing**: Simulates text extraction from images
- **AI Query Generation**: Creates search queries from extracted text
- **Processing Delays**: Simulates real API call timing

### 🚀 Real Implementation Requirements

To make this feature fully functional, you'll need to integrate:

#### 1. Google Cloud Vision API (Already Integrated!)
The OCR service is already integrated and ready to use! Just add your API key:

1. **Get API Key**: Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. **Enable Vision API**: Enable the Cloud Vision API for your project
3. **Create API Key**: Create a new API key with Vision API permissions
4. **Add to Environment**: Add to your `.env.local` file:
   ```bash
   NEXT_PUBLIC_GOOGLE_CLOUD_VISION_API_KEY=your_api_key_here
   ```

The service automatically falls back to mock data if no API key is provided.

#### 2. AI Query Generation
```typescript
// Replace the mock generateSearchQuery function with:
const generateSearchQuery = async (extractedText: string): Promise<string> => {
  const response = await fetch('/api/ai-query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: extractedText })
  });
  return await response.text();
};
```

## Integration Guide

### Option 1: Add to Existing SearchBar
```typescript
import { ImageUploadButton } from './ImageUploadButton';

// In your SearchBar component, add:
<ImageUploadButton
  onImageUpload={(query) => {
    setSearchValue(query);
    onSearch?.(query);
  }}
  size="md"
/>
```

### Option 2: Use the Wrapper Component
```typescript
import { SearchBarWithImageUpload } from './SearchBarWithImageUpload';

// Replace your existing SearchBar with:
<SearchBarWithImageUpload
  onSearch={handleSearch}
  onQueryStart={handleQueryStart}
  // ... other props
/>
```

### Option 3: Add to Chat Interface
```typescript
// In ChatInterface.tsx, add the button next to the send button:
<div className="flex items-center space-x-2">
  <ImageUploadButton
    onImageUpload={(query) => {
      setInputValue(query);
      handleSendMessage({ preventDefault: () => {} } as any);
    }}
    size="sm"
  />
  {/* existing send button */}
</div>
```

## API Endpoints Needed

### 1. OCR Endpoint
```typescript
// /api/ocr
export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get('image') as File;
  
  // Use your preferred OCR service
  const text = await extractTextFromImage(image);
  return Response.json({ text });
}
```

### 2. AI Query Generation Endpoint
```typescript
// /api/ai-query
export async function POST(request: Request) {
  const { text } = await request.json();
  
  // Use OpenAI, Claude, or other AI service
  const query = await generatePropertySearchQuery(text);
  return Response.json({ query });
}
```

## Cost Considerations

### OCR Services
- **Google Cloud Vision**: ~$1.50 per 1,000 images
- **Azure Computer Vision**: ~$1.00 per 1,000 images  
- **AWS Textract**: ~$1.50 per 1,000 images
- **Tesseract.js**: Free (client-side, less accurate)

### AI Services
- **OpenAI GPT-4**: ~$0.03 per request
- **Claude**: ~$0.02 per request
- **Local LLM**: Free (requires setup)

## Testing the Feature

1. **Start the development server**: `npm run dev`
2. **Import the component** in any file:
   ```typescript
   import { ImageUploadFeature } from './components/ImageUploadFeature';
   ```
3. **Add to your component**:
   ```typescript
   const [showImageUpload, setShowImageUpload] = useState(false);
   
   return (
     <>
       <button onClick={() => setShowImageUpload(true)}>
         Upload Screenshot
       </button>
       
       <ImageUploadFeature
         isVisible={showImageUpload}
         onImageProcessed={(query) => {
           console.log('Generated query:', query);
           setShowImageUpload(false);
         }}
         onClose={() => setShowImageUpload(false)}
       />
     </>
   );
   ```

## Removal Instructions

If you want to remove this feature:

1. **Delete the files**:
   - `ImageUploadFeature.tsx`
   - `ImageUploadButton.tsx` 
   - `SearchBarWithImageUpload.tsx`
   - `IMAGE_UPLOAD_README.md`

2. **Remove any imports** of these components from other files

3. **No other code changes needed** - the feature is completely isolated

## Future Enhancements

1. **Batch Processing**: Upload multiple screenshots at once
2. **Property Type Detection**: Automatically detect house vs flat
3. **Price Range Extraction**: Extract and format price ranges
4. **Location Intelligence**: Better location matching
5. **Image Quality Validation**: Check if image is clear enough for OCR
6. **Caching**: Cache OCR results for similar images
7. **Mobile Optimization**: Better mobile upload experience

## Security Considerations

1. **Image Validation**: Validate file types and sizes
2. **Rate Limiting**: Prevent abuse of OCR/AI services
3. **Data Privacy**: Handle uploaded images securely
4. **Content Filtering**: Ensure uploaded images are property-related
5. **Storage**: Decide whether to store images temporarily or permanently
