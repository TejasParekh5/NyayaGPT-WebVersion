# Azure Integration for NyaySetu

This document explains how to use Azure services with the NyaySetu legal chatbot application.

## Integrated Azure Services

The NyaySetu application now supports the following Azure services as fallbacks when Bhashini API is unavailable:

1. **Azure Translator Service** - For text translation between languages
2. **Azure Text Analytics** - For legal query analysis and understanding
3. **Azure Speech Services** - For speech-to-text and text-to-speech functionality

## Setup Instructions

### Prerequisites

1. An Azure account with at least 45 credits available
2. Access to Azure Portal (https://portal.azure.com)

### Configuration Steps

1. Set up the required Azure resources as described in [AZURE_DEPLOYMENT.md](./AZURE_DEPLOYMENT.md)
2. Create a `.env` file in the project root with the following variables (see `.env.azure` for reference):

```
# Azure Translator Service
AZURE_TRANSLATOR_KEY=your-azure-translator-key
AZURE_TRANSLATOR_REGION=eastus
AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com/

# Azure Text Analytics
AZURE_TEXT_ANALYTICS_KEY=your-azure-text-analytics-key
AZURE_TEXT_ANALYTICS_ENDPOINT=https://your-resource-name.cognitiveservices.azure.com/

# Azure Speech Service
AZURE_SPEECH_KEY=your-azure-speech-key
AZURE_SPEECH_REGION=eastus
```

3. Run the Azure integration test to verify your setup:

```powershell
npm run test:azure
```

## Key Features

### 1. Multilingual Translation

Azure Translator provides a fallback for Bhashini translation services, supporting all 10 languages used in the application:

- English
- Hindi
- Bengali
- Tamil
- Telugu
- Kannada
- Malayalam
- Marathi
- Gujarati
- Punjabi

Usage example:

```javascript
// Backend API endpoint: /translate
const response = await fetch("/translate", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		text: "How do I file an FIR?",
		sourceLanguage: "en",
		targetLanguage: "hi",
	}),
});
const result = await response.json();
console.log(result.translatedText);
```

### 2. Legal Query Analysis

Azure Text Analytics provides enhanced understanding of legal queries through:

- Sentiment analysis
- Key phrase extraction
- Entity recognition
- Legal response generation

Usage example:

```javascript
// Backend API endpoint: /analyze-legal-query
const response = await fetch("/analyze-legal-query", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		text: "What are my rights if I am arrested?",
		language: "en",
	}),
});
const result = await response.json();
console.log(result.analysis);
```

### 3. Speech Services

Azure Speech Services provide an alternative to Bhashini for:

- Converting spoken audio to text
- Converting text to natural-sounding speech in multiple languages

Usage example:

```javascript
// Speech-to-text endpoint remains the same
// It automatically falls back to Azure if Bhashini fails
const response = await fetch("/speech-to-text", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
		audio: base64EncodedAudio,
		language: "hi",
	}),
});
const result = await response.json();
console.log(result.text);
```

## Cost Optimization

To stay within the 45 Azure credit limit, see [AZURE_COST_OPTIMIZATION.md](./AZURE_COST_OPTIMIZATION.md) for detailed strategies to optimize costs while maintaining functionality.

## Troubleshooting

If you encounter issues with the Azure integration:

1. Verify your API keys and endpoints in the `.env` file
2. Check if your Azure resources are properly provisioned
3. Run the test script (`npm run test:azure`) to diagnose specific service issues
4. Review Azure Portal for any service disruptions or quota limitations
5. Check your credit usage to ensure you haven't exceeded your 45 credit limit
