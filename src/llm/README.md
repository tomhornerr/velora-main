# LLM Service for Chat Interface

This folder contains all LLM-related functionality for the chat interface. You can easily customize how the AI behaves by modifying the configuration files.

## Files

- **`llmService.ts`** - Main LLM service with API integrations
- **`config.ts`** - Configuration for AI personality and behavior
- **`README.md`** - This file

## Quick Start

The LLM service is already integrated into the chat interface. To customize the AI behavior:

1. **Edit `config.ts`** to change personality, response templates, and area knowledge
2. **Edit `llmService.ts`** to modify the system prompt or add new LLM providers
3. **Set your API key** in `.env.local` (see below)

## API Key Setup

### OpenAI (Recommended)
```bash
# In .env.local
OPENAI_API_KEY=your_openai_api_key_here
```

### Anthropic (Claude)
```bash
# In .env.local
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Cohere
```bash
# In .env.local
COHERE_API_KEY=your_cohere_api_key_here
```

## Customizing AI Behavior

### 1. Personality (in `config.ts`)

```typescript
export const LLM_PERSONALITY = {
  tone: 'professional', // 'professional', 'friendly', 'casual', 'formal'
  helpfulness: 'high', // 'high', 'medium', 'low'
  proactivity: 'medium', // 'high', 'medium', 'low'
  responseLength: 'concise', // 'concise', 'detailed', 'brief'
  useEmojis: false, // true, false
  useExamples: true, // true, false
};
```

### 2. Response Templates (in `config.ts`)

```typescript
export const RESPONSE_TEMPLATES = {
  greeting: "Hello! I'm here to help you find the perfect property...",
  clarification: {
    general: "I'd be happy to help you find property comparables!...",
    criteria: [
      "• Number of bedrooms (e.g., \"2 bed comps\")",
      "• Location or area", 
      "• Price range",
      "• Property type"
    ],
    example: "For example: \"2 bedroom comps in Bristol\"..."
  },
  // ... more templates
};
```

### 3. Area Knowledge (in `config.ts`)

```typescript
export const AREA_KNOWLEDGE = {
  areas: [
    'Clifton', 'Bristol', 'Filton', 'Redland', 'Montpelier', 
    'City Centre', 'Bath', 'Weston-super-Mare', 'Keynsham'
  ],
  characteristics: {
    'Clifton': {
      type: 'upscale',
      priceRange: 'high',
      features: ['Victorian architecture', 'village feel', 'independent shops']
    },
    // ... more areas
  }
};
```

### 4. System Prompt (in `llmService.ts`)

The main system prompt is in the `LLM_CONFIG` object:

```typescript
const LLM_CONFIG = {
  systemPrompt: `You are a professional property search assistant for Velora...
  // Customize this to change how the AI behaves
  `
};
```

## Adding New LLM Providers

To add a new LLM provider (e.g., Google Gemini, Mistral):

1. **Add the provider to `callLLMAPI`** in `llmService.ts`:

```typescript
} else if (LLM_CONFIG.provider === 'gemini' && process.env.GEMINI_API_KEY) {
  return await callGemini(prompt);
}
```

2. **Implement the provider function**:

```typescript
const callGemini = async (prompt: string): Promise<LLMAnalysisResult> => {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: LLM_CONFIG.temperature,
        maxOutputTokens: LLM_CONFIG.maxTokens
      }
    })
  });
  
  const data = await response.json();
  const content = data.candidates[0].content.parts[0].text;
  return JSON.parse(content);
};
```

3. **Update the provider in `llmService.ts`**:

```typescript
const LLM_CONFIG = {
  provider: 'gemini', // Change this to your preferred provider
  // ... rest of config
};
```

## Testing

To test the LLM integration:

1. **Set your API key** in `.env.local`
2. **Start the development server**: `npm run dev`
3. **Open the chat interface** and try queries like:
   - "hello" (should get a friendly greeting)
   - "comps" (should ask for clarification)
   - "2 bed comps in clifton" (should search for properties)

## Fallback Behavior

If no API key is set or the LLM fails, the system automatically falls back to a rule-based mock analysis that still provides good responses for common queries.

## Debugging

Check the browser console for:
- `LLM Analysis:` logs showing the AI's decision process
- `Error in...` logs if something goes wrong
- API response logs from the LLM service

## Need Help?

The LLM service is designed to be easily customizable. If you need help:
1. Check the console logs for errors
2. Verify your API key is set correctly
3. Test with simple queries first
4. Check the fallback mock analysis is working
