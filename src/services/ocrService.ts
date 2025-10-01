/**
 * Google Cloud Vision API OCR Service
 * Handles image text extraction using Google Cloud Vision API
 */

export interface OCRResult {
  text: string;
  confidence: number;
  error?: string;
}

export interface GoogleVisionResponse {
  responses: Array<{
    textAnnotations: Array<{
      description: string;
      boundingPoly: {
        vertices: Array<{
          x: number;
          y: number;
        }>;
      };
    }>;
    fullTextAnnotation?: {
      text: string;
      pages: Array<{
        property: {
          detectedLanguages: Array<{
            languageCode: string;
            confidence: number;
          }>;
        };
      }>;
    };
  }>;
}

class OCRService {
  private apiKey: string;
  private baseUrl = 'https://vision.googleapis.com/v1/images:annotate';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_VISION_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Google Cloud Vision API key not found. OCR will use mock data.');
    }
  }

  /**
   * Extract text from an image using Google Cloud Vision API
   */
  async extractTextFromImage(imageFile: File): Promise<OCRResult> {
    if (!this.apiKey) {
      return this.getMockOCRResult();
    }

    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // Prepare request body
      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 1
              }
            ]
          }
        ]
      };

      // Make API request
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Google Vision API error: ${response.status} ${response.statusText}`);
      }

      const data: GoogleVisionResponse = await response.json();
      
      // Extract text from response
      const textAnnotations = data.responses[0]?.textAnnotations;
      if (!textAnnotations || textAnnotations.length === 0) {
        return {
          text: '',
          confidence: 0,
          error: 'No text detected in image'
        };
      }

      // Get the full text (first annotation contains all text)
      const fullText = textAnnotations[0].description;
      const confidence = this.calculateConfidence(data.responses[0]);

      return {
        text: fullText,
        confidence
      };

    } catch (error) {
      console.error('OCR processing error:', error);
      return {
        text: '',
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Convert file to base64 string
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/...;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Calculate confidence score based on response data
   */
  private calculateConfidence(response: any): number {
    // Simple confidence calculation based on number of text annotations
    const textCount = response.textAnnotations?.length || 0;
    const confidence = Math.min(0.95, Math.max(0.1, textCount * 0.1));
    return Math.round(confidence * 100) / 100;
  }

  /**
   * Mock OCR result for development/testing
   */
  private getMockOCRResult(): OCRResult {
    const mockTexts = [
      "3 bedroom detached house in Clifton, Bristol. £650,000. Modern kitchen, garden, parking.",
      "2 bed flat in Redland, £425,000. Recently renovated, close to university.",
      "4 bedroom family home in Montpelier, £750,000. Victorian terrace, period features.",
      "1 bed apartment in City Centre, £350,000. New build, concierge service.",
      "5 bedroom house in Filton, £550,000. Large garden, garage, near airport.",
      "2 bedroom terraced house in Redland, £480,000. Period features, close to shops.",
      "3 bed semi-detached in Clifton, £520,000. Recently refurbished, off-street parking.",
      "1 bedroom studio in City Centre, £280,000. Modern finish, great transport links."
    ];
    
    const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
    
    return {
      text: randomText,
      confidence: 0.85 + Math.random() * 0.1 // 85-95% confidence
    };
  }

  /**
   * Check if OCR service is available
   */
  isAvailable(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get service status
   */
  getStatus(): { available: boolean; service: string } {
    return {
      available: this.isAvailable(),
      service: this.isAvailable() ? 'Google Cloud Vision API' : 'Mock OCR (Development)'
    };
  }
}

// Export singleton instance
export const ocrService = new OCRService();

// Export class for testing
export { OCRService };
