// OpenAI API service for intelligent query processing
export interface QueryAnalysis {
  processedQuery: string;
  searchType: 'address' | 'area' | 'postcode' | 'landmark' | 'ambiguous';
  confidence: number;
  suggestions?: string[];
  reasoning?: string;
  extractedLocation?: string;
  searchIntent?: string;
}

export interface PropertyQueryAnalysis {
  bedrooms?: number;
  propertyType?: string[];
  priceRange?: { min?: number; max?: number };
  epcRating?: string;
  location?: string;
  features?: string[];
  searchType: 'refinement' | 'new_search';
  confidence: number;
  reasoning?: string;
  extractedCriteria?: string;
}

export class OpenAIService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
  }

  async analyzeQuery(query: string): Promise<QueryAnalysis> {
    if (!this.apiKey) {
      console.warn('OpenAI API key not provided, falling back to rule-based processing');
      return this.fallbackAnalysis(query);
    }

    try {
      const prompt = this.createAnalysisPrompt(query);
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Using the more cost-effective model
          messages: [
            {
              role: 'system',
              content: `You are an expert location search assistant specializing in Bristol, UK property searches. 
              Analyze user queries and determine the best search strategy for finding locations on a map.
              
              You understand:
              - Bristol neighborhoods (Clifton, Bishopston, Redland, etc.)
              - UK postcodes (BS1, BS8, etc.)
              - Property addresses
              - Landmarks and points of interest
              - Natural language location descriptions
              
              Always respond with valid JSON only.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response from OpenAI API');
      }

      // Parse the JSON response
      const analysis = JSON.parse(content);
      return this.validateAnalysis(analysis, query);

    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.fallbackAnalysis(query);
    }
  }

  private createAnalysisPrompt(query: string): string {
    return `Analyze this location search query: "${query}"

Return a JSON object with:
{
  "processedQuery": "optimized search term",
  "searchType": "address|area|postcode|landmark|ambiguous",
  "confidence": 0.0-1.0,
  "suggestions": ["suggestion1", "suggestion2"],
  "reasoning": "brief explanation",
  "extractedLocation": "main location mentioned",
  "searchIntent": "what user is looking for"
}

Guidelines:
- For addresses (containing numbers): searchType = "address", high confidence
- For areas/neighborhoods: searchType = "area", high confidence  
- For postcodes (BS1, BS8, etc.): searchType = "postcode", high confidence
- For landmarks: searchType = "landmark", medium confidence
- For ambiguous queries: searchType = "ambiguous", low confidence, provide suggestions
- Always optimize the processedQuery for best geocoding results
- Focus on Bristol, UK context
- Provide helpful suggestions for ambiguous queries

Examples:
- "Clifton" → {"searchType": "area", "confidence": 0.9, "processedQuery": "Clifton, Bristol"}
- "24 Runthorpe Road" → {"searchType": "address", "confidence": 0.8, "processedQuery": "24 Runthorpe Road, Bristol"}
- "BS8" → {"searchType": "postcode", "confidence": 0.9, "processedQuery": "BS8, Bristol"}
- "university" → {"searchType": "landmark", "confidence": 0.7, "processedQuery": "University of Bristol"}
- "somewhere nice" → {"searchType": "ambiguous", "confidence": 0.3, "suggestions": ["Clifton", "Bishopston", "Redland"]}`;
  }

  private validateAnalysis(analysis: any, originalQuery: string): QueryAnalysis {
    // Ensure required fields exist with defaults
    return {
      processedQuery: analysis.processedQuery || originalQuery,
      searchType: analysis.searchType || 'ambiguous',
      confidence: Math.max(0, Math.min(1, analysis.confidence || 0.5)),
      suggestions: analysis.suggestions || [],
      reasoning: analysis.reasoning || '',
      extractedLocation: analysis.extractedLocation || '',
      searchIntent: analysis.searchIntent || 'location search'
    };
  }

  private fallbackAnalysis(query: string): QueryAnalysis {
    // Fallback to rule-based analysis when OpenAI is not available
    const lowerQuery = query.toLowerCase().trim();
    
    // Postcode detection
    if (/^[a-z]{1,2}\d[a-z\d]?\s?\d[a-z]{2}$/i.test(query)) {
      return {
        processedQuery: query.toUpperCase(),
        searchType: 'postcode',
        confidence: 0.9,
        reasoning: 'Detected UK postcode format',
        extractedLocation: query.toUpperCase()
      };
    }
    
    // Address detection
    if (/\d/.test(query)) {
      return {
        processedQuery: query,
        searchType: 'address',
        confidence: 0.8,
        reasoning: 'Contains numbers, likely an address',
        extractedLocation: query
      };
    }
    
    // Area detection
    const areaKeywords = [
      'clifton', 'bishopston', 'redland', 'stokes croft', 'montpelier', 
      'st pauls', 'easton', 'bedminster', 'southville', 'windmill hill',
      'hotwells', 'kingsdown', 'cotham', 'redcliffe', 'temple meads'
    ];
    
    const isKnownArea = areaKeywords.some(keyword => 
      lowerQuery.includes(keyword)
    );
    
    if (isKnownArea) {
      return {
        processedQuery: query,
        searchType: 'area',
        confidence: 0.9,
        reasoning: 'Recognized Bristol area',
        extractedLocation: query
      };
    }
    
    // Landmark detection
    const landmarkKeywords = [
      'university', 'hospital', 'station', 'airport', 'park', 'bridge',
      'cathedral', 'museum', 'gallery', 'theatre', 'stadium'
    ];
    
    const isLandmark = landmarkKeywords.some(keyword => 
      lowerQuery.includes(keyword)
    );
    
    if (isLandmark) {
      return {
        processedQuery: query,
        searchType: 'landmark',
        confidence: 0.7,
        reasoning: 'Detected landmark keywords',
        extractedLocation: query
      };
    }
    
    // Default ambiguous
    return {
      processedQuery: query,
      searchType: 'ambiguous',
      confidence: 0.3,
      suggestions: [
        'Try: "Clifton" for Clifton area',
        'Try: "BS8" for postcode',
        'Try: "24 Runthorpe Road" for specific address',
        'Try: "Bristol University" for landmarks'
      ],
      reasoning: 'Query is ambiguous, needs clarification',
      extractedLocation: query
    };
  }

  async analyzePropertyQuery(query: string, previousResults: any[] = []): Promise<PropertyQueryAnalysis> {
    if (!this.apiKey) {
      console.warn('OpenAI API key not provided, falling back to rule-based processing');
      return this.fallbackPropertyAnalysis(query, previousResults);
    }

    try {
      const prompt = this.createPropertyAnalysisPrompt(query, previousResults);
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an intelligent property search assistant for a Bristol-based property platform. Your task is to analyze user queries and extract specific search criteria for property filtering.

              Respond with a JSON object containing:
              - \`bedrooms\`: Number of bedrooms requested (if specified)
              - \`propertyType\`: Array of property types (e.g., ["Detached", "Semi-Detached", "Terraced", "Apartment"])
              - \`priceRange\`: Object with min/max price in pounds (e.g., {min: 300000, max: 500000})
              - \`epcRating\`: EPC rating letter (A, B, C, D, E) if specified
              - \`location\`: Specific area in Bristol (e.g., "Clifton", "Harbourside", "Redland")
              - \`features\`: Array of property features (e.g., ["Garden", "Parking", "Garage", "Balcony"])
              - \`searchType\`: "refinement" if refining previous results, "new_search" if starting fresh
              - \`confidence\`: Number from 0.0 to 1.0 indicating certainty
              - \`reasoning\`: Brief explanation of your analysis
              - \`extractedCriteria\`: Summary of what criteria were extracted

              Examples:
              - User: "actually give me a house with EPC C rating only"
                Output: { "propertyType": ["Detached", "Semi-Detached", "Terraced"], "epcRating": "C", "searchType": "refinement", "confidence": 0.9, "reasoning": "User wants to refine to houses with C EPC rating", "extractedCriteria": "Houses with EPC C rating" }
              
              - User: "find me 3 beds in harbourside"
                Output: { "bedrooms": 3, "location": "Harbourside", "searchType": "new_search", "confidence": 0.95, "reasoning": "Clear request for 3-bedroom properties in Harbourside", "extractedCriteria": "3 bedrooms in Harbourside" }
              
              - User: "show me modern apartments under 400k"
                Output: { "propertyType": ["Apartment"], "priceRange": { "max": 400000 }, "features": ["Modern"], "searchType": "new_search", "confidence": 0.9, "reasoning": "Modern apartments under £400k", "extractedCriteria": "Modern apartments under £400k" }
              
              - User: "I want something with a garden and parking"
                Output: { "features": ["Garden", "Parking"], "searchType": "refinement", "confidence": 0.8, "reasoning": "User wants properties with garden and parking", "extractedCriteria": "Properties with garden and parking" }`
            },
            {
              role: 'user',
              content: `Query: "${query}"${previousResults.length > 0 ? `\n\nPrevious results context: ${previousResults.length} properties currently displayed` : ''}`
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      if (!content) {
        throw new Error("OpenAI did not return content.");
      }
      
      return JSON.parse(content) as PropertyQueryAnalysis;

    } catch (error) {
      console.error("Error analyzing property query with OpenAI:", error);
      return this.fallbackPropertyAnalysis(query, previousResults);
    }
  }

  private createPropertyAnalysisPrompt(query: string, previousResults: any[] = []): string {
    return `Analyze this property search query: "${query}"${previousResults.length > 0 ? `\n\nPrevious results context: ${previousResults.length} properties currently displayed` : ''}`;
  }

  private fallbackPropertyAnalysis(query: string, previousResults: any[] = []): PropertyQueryAnalysis {
    const lowerQuery = query.toLowerCase();
    
    // Extract bedroom count
    const bedroomMatch = lowerQuery.match(/(\d+)\s*bed/i);
    const bedrooms = bedroomMatch ? parseInt(bedroomMatch[1]) : undefined;
    
    // Extract property type
    let propertyType: string[] | undefined = undefined;
    if (lowerQuery.includes('house')) propertyType = ['Detached', 'Semi-Detached', 'Terraced'];
    if (lowerQuery.includes('flat') || lowerQuery.includes('apartment')) propertyType = ['Apartment'];
    if (lowerQuery.includes('detached')) propertyType = ['Detached'];
    if (lowerQuery.includes('semi')) propertyType = ['Semi-Detached'];
    if (lowerQuery.includes('terraced')) propertyType = ['Terraced'];
    
    // Extract price range
    let priceRange: { min?: number; max?: number } | undefined = undefined;
    if (lowerQuery.includes('under') && lowerQuery.includes('300k')) priceRange = { max: 300000 };
    if (lowerQuery.includes('300k') && lowerQuery.includes('500k')) priceRange = { min: 300000, max: 500000 };
    if (lowerQuery.includes('500k') && lowerQuery.includes('800k')) priceRange = { min: 500000, max: 800000 };
    if (lowerQuery.includes('over') && lowerQuery.includes('800k')) priceRange = { min: 800000 };
    
    // Extract EPC rating
    let epcRating: string | undefined = undefined;
    if (lowerQuery.includes('epc') && lowerQuery.includes('a')) epcRating = 'A';
    if (lowerQuery.includes('epc') && lowerQuery.includes('b')) epcRating = 'B';
    if (lowerQuery.includes('epc') && lowerQuery.includes('c')) epcRating = 'C';
    if (lowerQuery.includes('epc') && lowerQuery.includes('d')) epcRating = 'D';
    if (lowerQuery.includes('epc') && lowerQuery.includes('e')) epcRating = 'E';
    
    // Extract location preferences
    let location: string | undefined = undefined;
    if (lowerQuery.includes('harbourside')) location = 'Harbourside';
    if (lowerQuery.includes('clifton')) location = 'Clifton';
    if (lowerQuery.includes('redland')) location = 'Redland';
    if (lowerQuery.includes('bedminster')) location = 'Bedminster';
    if (lowerQuery.includes('montpelier')) location = 'Montpelier';
    
    // Extract features
    const features: string[] = [];
    if (lowerQuery.includes('garden')) features.push('Garden');
    if (lowerQuery.includes('parking')) features.push('Parking');
    if (lowerQuery.includes('garage')) features.push('Garage');
    if (lowerQuery.includes('balcony')) features.push('Balcony');
    if (lowerQuery.includes('modern')) features.push('Modern');
    if (lowerQuery.includes('period')) features.push('Period Features');
    
    return {
      bedrooms,
      propertyType,
      priceRange,
      epcRating,
      location,
      features: features.length > 0 ? features : undefined,
      searchType: previousResults.length > 0 ? 'refinement' : 'new_search',
      confidence: 0.7,
      reasoning: 'Fallback rule-based analysis',
      extractedCriteria: `Extracted: ${bedrooms ? bedrooms + ' beds' : ''} ${propertyType ? propertyType.join(', ') : ''} ${priceRange ? '£' + (priceRange.min || 0) + '-' + (priceRange.max || '∞') : ''} ${epcRating ? 'EPC ' + epcRating : ''} ${location || ''} ${features.join(', ')}`.trim()
    };
  }
}

// Export singleton instance
export const openaiService = new OpenAIService();
