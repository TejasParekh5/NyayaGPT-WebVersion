# Azure Cognitive Services Integration Guide

## Setting up Azure Cognitive Services for NyaySetu

This guide explains how to integrate Azure Cognitive Services to enhance your NyaySetu application's language capabilities.

### 1. Create Azure Cognitive Services Multi-Service Resource

1. Log in to the Azure Portal
2. Click "Create a resource" > "AI + Machine Learning" > "Cognitive Services"
3. Configure as follows:
   - **Resource Group**: "nyaysetu-rg" (use the same as App Service)
   - **Region**: East US (or region closest to your users)
   - **Name**: "nyaysetu-cognitive"
   - **Pricing tier**: Standard S0 (or Free tier to start)
4. Click "Review + Create" > "Create"

### 2. Get Your Cognitive Services API Keys

1. Go to your Cognitive Services resource
2. Navigate to "Keys and Endpoint"
3. Copy Key 1 and the Endpoint URL

### 3. Integrate Azure Translator Service

Create a new file at `backend/services/azureTranslatorService.js`:

```javascript
// Azure Translator Service
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const AZURE_COGNITIVE_KEY = process.env.AZURE_COGNITIVE_KEY;
const AZURE_COGNITIVE_REGION = process.env.AZURE_COGNITIVE_REGION || "eastus";

/**
 * Translates text using Azure Translator service
 * @param {string} text - Text to translate
 * @param {string} sourceLanguage - Source language code
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<string>} Translated text
 */
export const translateText = async (text, sourceLanguage, targetLanguage) => {
	try {
		// Map language codes to Azure format if needed
		const sourceLang = mapLanguageCode(sourceLanguage);
		const targetLang = mapLanguageCode(targetLanguage);

		// If source and target are the same, return the original text
		if (sourceLang === targetLang) {
			return text;
		}

		console.log(`Azure translating from ${sourceLang} to ${targetLang}`);

		const endpoint = "https://api.cognitive.microsofttranslator.com";
		const response = await axios({
			baseURL: endpoint,
			url: "/translate",
			method: "post",
			headers: {
				"Ocp-Apim-Subscription-Key": AZURE_COGNITIVE_KEY,
				"Ocp-Apim-Subscription-Region": AZURE_COGNITIVE_REGION,
				"Content-type": "application/json",
			},
			params: {
				"api-version": "3.0",
				from: sourceLang,
				to: targetLang,
			},
			data: [
				{
					text: text,
				},
			],
			responseType: "json",
		});

		const translatedText = response.data[0]?.translations[0]?.text || text;
		return translatedText;
	} catch (error) {
		console.error("Azure Translator API error:", error);
		throw error;
	}
};

/**
 * Detect the language of a text using Azure
 * @param {string} text - Text to detect language for
 * @returns {Promise<string>} Detected language code
 */
export const detectLanguage = async (text) => {
	try {
		const endpoint = "https://api.cognitive.microsofttranslator.com";
		const response = await axios({
			baseURL: endpoint,
			url: "/detect",
			method: "post",
			headers: {
				"Ocp-Apim-Subscription-Key": AZURE_COGNITIVE_KEY,
				"Ocp-Apim-Subscription-Region": AZURE_COGNITIVE_REGION,
				"Content-type": "application/json",
			},
			params: {
				"api-version": "3.0",
			},
			data: [
				{
					text: text,
				},
			],
			responseType: "json",
		});

		// Return detected language code
		return response.data[0]?.language || "en";
	} catch (error) {
		console.error("Azure language detection error:", error);
		return "en"; // Default to English on failure
	}
};

/**
 * Maps language codes to Azure Translator format
 */
const mapLanguageCode = (code) => {
	const mapping = {
		hi: "hi",
		en: "en",
		bn: "bn",
		ta: "ta",
		te: "te",
		kn: "kn",
		ml: "ml",
		mr: "mr",
		gu: "gu",
		pa: "pa",
	};

	return mapping[code] || code;
};
```

### 4. Integrate Azure Text Analytics

Create a new file at `backend/services/azureTextAnalyticsService.js`:

```javascript
// Azure Text Analytics Service
import {
	TextAnalyticsClient,
	AzureKeyCredential,
} from "@azure/ai-text-analytics";
import dotenv from "dotenv";

dotenv.config();

const AZURE_COGNITIVE_KEY = process.env.AZURE_COGNITIVE_KEY;
const AZURE_COGNITIVE_ENDPOINT = process.env.AZURE_COGNITIVE_ENDPOINT;

// Create Text Analytics client
const textAnalyticsClient = new TextAnalyticsClient(
	AZURE_COGNITIVE_ENDPOINT,
	new AzureKeyCredential(AZURE_COGNITIVE_KEY)
);

/**
 * Extract key phrases from text
 * @param {string} text - Text to analyze
 * @param {string} language - Language code
 * @returns {Promise<string[]>} Array of key phrases
 */
export const extractKeyPhrases = async (text, language = "en") => {
	try {
		const results = await textAnalyticsClient.extractKeyPhrases([
			{ id: "1", language, text },
		]);

		if (results && results[0] && !results[0].error) {
			return results[0].keyPhrases;
		}
		return [];
	} catch (error) {
		console.error("Azure Key Phrase Extraction Error:", error);
		return [];
	}
};

/**
 * Analyze sentiment of text
 * @param {string} text - Text to analyze
 * @param {string} language - Language code
 * @returns {Promise<object>} Sentiment analysis result
 */
export const analyzeSentiment = async (text, language = "en") => {
	try {
		const results = await textAnalyticsClient.analyzeSentiment([
			{ id: "1", language, text },
		]);

		if (results && results[0] && !results[0].error) {
			return {
				sentiment: results[0].sentiment,
				confidenceScores: results[0].confidenceScores,
			};
		}
		return {
			sentiment: "neutral",
			confidenceScores: { positive: 0, neutral: 1, negative: 0 },
		};
	} catch (error) {
		console.error("Azure Sentiment Analysis Error:", error);
		return {
			sentiment: "neutral",
			confidenceScores: { positive: 0, neutral: 1, negative: 0 },
		};
	}
};
```

### 5. Update Your Server with Azure Integration

Update your `.env` file to include the Azure keys:

```
# Azure configuration
AZURE_COGNITIVE_KEY=your_azure_key_here
AZURE_COGNITIVE_ENDPOINT=your_endpoint_here
AZURE_COGNITIVE_REGION=eastus
```

Modify your `server.js` to use Azure as a backup service to Bhashini:

```javascript
// Import Azure services
import {
	translateText as azureTranslateText,
	detectLanguage as azureDetectLanguage,
} from "./services/azureTranslatorService.js";
import {
	extractKeyPhrases,
	analyzeSentiment,
} from "./services/azureTextAnalyticsService.js";
```

Update your chat endpoint to use Azure as a fallback:

```javascript
// In your chat endpoint
if (language !== "en") {
	try {
		// First try Bhashini
		searchMessage = await bhashiniTranslateText(userMessage, language, "en");
	} catch (bhashiniError) {
		console.error("Bhashini translation error, trying Azure:", bhashiniError);
		// Fallback to Azure
		searchMessage = await azureTranslateText(userMessage, language, "en");
	}
	searchMessage = searchMessage.toLowerCase();
}
```

### 6. Use Azure Text Analytics to Improve Response Quality

Enhance your chat logic with sentiment and key phrase extraction:

```javascript
// In your chat endpoint
try {
	// Extract key phrases to improve keyword matching
	const keyPhrases = await extractKeyPhrases(searchMessage, "en");
	console.log("Extracted key phrases:", keyPhrases);

	// Check key phrases against your database
	for (const phrase of keyPhrases) {
		Object.entries(legalDatabase).forEach(([keyword, info]) => {
			if (phrase.toLowerCase().includes(keyword.toLowerCase())) {
				reply = info;
				foundMatch = true;
			}
		});
		if (foundMatch) break;
	}

	// Analyze sentiment to customize response tone
	const sentiment = await analyzeSentiment(userMessage, language);
	console.log("Message sentiment:", sentiment.sentiment);

	// Adjust response based on sentiment if needed
} catch (error) {
	console.error("Error using Azure Text Analytics:", error);
}
```
