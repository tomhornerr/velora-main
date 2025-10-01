// LLM Service for Chat Interface
// This file contains all LLM-related functionality for the chat interface

export interface LLMAnalysisResult {
  isPropertyRelated: boolean;
  needsClarification: boolean;
  extractedCriteria: {
    bedrooms?: number;
    bathrooms?: number;
    location?: string;
    priceRange?: { min?: number; max?: number };
  };
  responseType: 'property_search' | 'general_response' | 'clarification' | 'content_creation' | 'data_analysis';
  suggestedResponse?: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// LLM Configuration
const LLM_CONFIG = {
  // You can easily switch between different LLM providers here
  provider: 'openai', // 'openai', 'anthropic', 'cohere', 'mock'
  model: 'gpt-4',
  temperature: 0.1,
  maxTokens: 500,
  systemPrompt: `You are a professional AI assistant for Velora, a property platform. You provide precise, intelligent responses without unnecessary verbosity.

## Core Principles:
- **Concise**: Keep responses short and to the point
- **Professional**: Maintain a business-appropriate tone
- **Intelligent**: Provide accurate, well-reasoned answers
- **Efficient**: Get to the point quickly without filler

## Capabilities:
- Property search and analysis
- Content creation and text refinement
- General question answering
- Data analysis and insights

## Response Guidelines:
- Use clear, direct language
- Avoid emojis and conversational fillers
- Provide specific, actionable information
- Keep responses under 2-3 sentences unless complex analysis is needed

## Response Types:
- "clarification": Need more specific information
- "property_search": Ready to search properties
- "general_response": General questions or assistance
- "content_creation": Writing or editing help
- "data_analysis": Data insights or analysis

Always respond with valid JSON only.`
};

// Main LLM Analysis Function
export const analyzeQueryWithLLM = async (
  query: string, 
  messageHistory: Message[]
): Promise<LLMAnalysisResult> => {
  const recentMessages = messageHistory.slice(-5).map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  const prompt = `
Analyze this user query and provide a concise, professional response.

User Query: "${query}"

Recent Message History:
${recentMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

## Context:
- User is on Velora, a property platform
- Available areas: Clifton, Bristol, Filton, Redland, Montpelier, City Centre
- Bedroom counts: 1-5, Bathroom counts: 1-4
- Price range: £280k - £1.2M

## Analysis:
1. Detect intent: Property search, general question, content creation, or data analysis?
2. Assess clarity: Does the user need clarification?
3. Extract criteria: Bedrooms, bathrooms, location, price range
4. Craft response: Keep it concise and professional

## Response Format:
{
  "isPropertyRelated": boolean,
  "needsClarification": boolean,
  "extractedCriteria": {
    "bedrooms": number or null,
    "bathrooms": number or null,
    "location": "string or null",
    "priceRange": {"min": number, "max": number} or null
  },
  "responseType": "property_search" | "general_response" | "clarification" | "content_creation" | "data_analysis",
  "suggestedResponse": "string"
}

## Examples:
- "hello" → {"isPropertyRelated": false, "needsClarification": false, "extractedCriteria": {}, "responseType": "general_response", "suggestedResponse": "Hello. How can I help you today?"}
- "comps" → {"isPropertyRelated": true, "needsClarification": true, "extractedCriteria": {}, "responseType": "clarification", "suggestedResponse": "I can help you find property comparables. Please specify: bedrooms, location, and price range."}
- "2 bed comps in clifton" → {"isPropertyRelated": true, "needsClarification": false, "extractedCriteria": {"bedrooms": 2, "bathrooms": null, "location": "clifton", "priceRange": null}, "responseType": "property_search", "suggestedResponse": "Found 2-bedroom properties in Clifton."}
- "help me write a property description" → {"isPropertyRelated": false, "needsClarification": false, "extractedCriteria": {}, "responseType": "content_creation", "suggestedResponse": "I can help you write property descriptions. What property details do you have?"}
- "what's the meaning of life" → {"isPropertyRelated": false, "needsClarification": false, "extractedCriteria": {}, "responseType": "general_response", "suggestedResponse": "That's a philosophical question. How can I assist you with property-related matters?"}
`;

  try {
    return await callLLMAPI(prompt, query, messageHistory);
  } catch (error) {
    console.error('LLM analysis failed, using fallback:', error);
    return await mockLLMAnalysis(query, messageHistory);
  }
};

// LLM API Integration
const callLLMAPI = async (
  prompt: string, 
  query: string, 
  messageHistory: Message[]
): Promise<LLMAnalysisResult> => {
  if (LLM_CONFIG.provider === 'openai' && process.env.OPENAI_API_KEY) {
    return await callOpenAI(prompt);
  } else if (LLM_CONFIG.provider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
    return await callAnthropic(prompt);
  } else if (LLM_CONFIG.provider === 'cohere' && process.env.COHERE_API_KEY) {
    return await callCohere(prompt);
  } else {
    console.log('No LLM API key found, using mock analysis');
    return await mockLLMAnalysis(query, messageHistory);
  }
};

// OpenAI Integration
const callOpenAI = async (prompt: string): Promise<LLMAnalysisResult> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: LLM_CONFIG.model,
      messages: [
        { role: 'system', content: LLM_CONFIG.systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: LLM_CONFIG.temperature,
      max_tokens: LLM_CONFIG.maxTokens
    })
  });
  
  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
};

// Anthropic Integration (Claude)
const callAnthropic = async (prompt: string): Promise<LLMAnalysisResult> => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: LLM_CONFIG.maxTokens,
      messages: [
        { role: 'user', content: `${LLM_CONFIG.systemPrompt}\n\n${prompt}` }
      ]
    })
  });
  
  const data = await response.json();
  const content = data.content[0].text;
  return JSON.parse(content);
};

// Cohere Integration
const callCohere = async (prompt: string): Promise<LLMAnalysisResult> => {
  const response = await fetch('https://api.cohere.ai/v1/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'command',
      prompt: `${LLM_CONFIG.systemPrompt}\n\n${prompt}`,
      max_tokens: LLM_CONFIG.maxTokens,
      temperature: LLM_CONFIG.temperature
    })
  });
  
  const data = await response.json();
  const content = data.generations[0].text;
  return JSON.parse(content);
};

// Fallback Mock Analysis
const mockLLMAnalysis = async (query: string, messageHistory: Message[]): Promise<LLMAnalysisResult> => {
  const lowerQuery = query.toLowerCase();
  
  // Simple property detection
  const propertyKeywords = [
    'property', 'properties', 'comp', 'comps', 'comparable', 'comparables', 
    'house', 'houses', 'home', 'homes', 'real estate', 'listing', 'listings', 
    'bed', 'bedroom', 'bedrooms', 'bath', 'bathroom', 'bathrooms'
  ];
  const isPropertyRelated = propertyKeywords.some(keyword => lowerQuery.includes(keyword));

  if (!isPropertyRelated) {
    // Check if it's a content creation request
    const contentKeywords = ['write', 'create', 'help me write', 'draft', 'compose', 'generate', 'refine', 'edit', 'improve', 'rewrite'];
    const isContentRequest = contentKeywords.some(keyword => lowerQuery.includes(keyword));
    
    if (isContentRequest) {
      return {
        isPropertyRelated: false,
        needsClarification: false,
        extractedCriteria: {},
        responseType: 'content_creation',
        suggestedResponse: "I can help you write property descriptions. What property details do you have?"
      };
    }
    
    return {
      isPropertyRelated: false,
      needsClarification: false,
      extractedCriteria: {},
      responseType: 'general_response',
      suggestedResponse: "Hello. How can I help you today?"
    };
  }

  // Extract criteria
  const bedroomMatch = lowerQuery.match(/(\d+)\s*(?:bed|bedroom|bedrooms)/);
  const bathroomMatch = lowerQuery.match(/(\d+)\s*(?:bath|bathroom|bathrooms)/);
  const locationMatch = lowerQuery.match(/(?:in|at|near|around)\s+([a-zA-Z\s]+?)(?:\s|$|,|\.)/);
  
  const extractedCriteria = {
    bedrooms: bedroomMatch ? parseInt(bedroomMatch[1]) : undefined,
    bathrooms: bathroomMatch ? parseInt(bathroomMatch[1]) : undefined,
    location: locationMatch ? locationMatch[1].trim().toLowerCase() : undefined,
    priceRange: undefined
  };

  // Check if needs clarification
  const vagueTerms = ['comps', 'comp', 'comparable', 'comparables', 'properties', 'property'];
  const hasVagueTerms = vagueTerms.some(term => lowerQuery.includes(term));
  const hasSpecificTerms = bedroomMatch || bathroomMatch || locationMatch || 
                          lowerQuery.includes('price') || lowerQuery.includes('value');
  
  const needsClarification = hasVagueTerms && !hasSpecificTerms;

  if (needsClarification) {
    return {
      isPropertyRelated: true,
      needsClarification: true,
      extractedCriteria: {},
      responseType: 'clarification',
      suggestedResponse: "I can help you find property comparables. Please specify: bedrooms, location, and price range."
    };
  }

  return {
    isPropertyRelated: true,
    needsClarification: false,
    extractedCriteria,
    responseType: 'property_search',
    suggestedResponse: `Found properties matching your criteria.`
  };
};

// Export configuration for easy modification
export { LLM_CONFIG };
