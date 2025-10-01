# OpenAI Integration Setup

## Overview
The map search now uses OpenAI's GPT-4o-mini model for intelligent query processing, providing:
- Natural language understanding
- Smart query classification
- Contextual suggestions
- AI reasoning for search decisions

## Setup Instructions

### 1. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Create a new API key
4. Copy the key (starts with `sk-`)

### 2. Configure Environment Variables
Create a `.env.local` file in the project root:

```bash
# OpenAI API Configuration
OPENAI_API_KEY= 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
```

### 3. Restart Development Server
```bash
npm run dev
```

## Features

### Intelligent Query Processing
- **Address Detection**: "24 Runthorpe Road" → Precise location search
- **Area Recognition**: "Clifton" → Full area view with bounding box
- **Postcode Handling**: "BS8" → Postcode area coverage
- **Landmark Identification**: "Bristol University" → Point of interest search
- **Ambiguous Query Handling**: Provides smart suggestions for unclear queries

### AI-Powered Suggestions
- Shows AI reasoning for search decisions
- Provides contextual suggestions for ambiguous queries
- Displays search intent analysis
- Auto-dismisses suggestions after 8 seconds

### Fallback System
- If OpenAI API is unavailable, falls back to rule-based processing
- Graceful error handling with user-friendly messages
- Maintains full functionality even without API key

## Cost Considerations
- Uses GPT-4o-mini (most cost-effective model)
- Typical cost: ~$0.001-0.005 per search query
- Optimized prompts to minimize token usage
- Automatic fallback prevents unnecessary API calls

## Testing
Try these queries to see OpenAI intelligence in action:
- "somewhere nice in Bristol" → Should show area suggestions
- "near the university" → Should understand landmark context
- "BS8 area" → Should recognize postcode + area combination
- "xyz" → Should provide helpful suggestions

## Troubleshooting
- Check browser console for API errors
- Verify API key is correctly set in environment
- Ensure you have OpenAI API credits
- Check network connectivity for API calls
