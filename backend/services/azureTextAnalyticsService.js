// Azure Text Analytics Service
// This service provides text analysis capabilities using Azure Cognitive Services
// It can enhance the chatbot with sentiment analysis and key phrase extraction

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Azure Text Analytics configuration
const AZURE_TEXT_ANALYTICS_KEY = process.env.AZURE_TEXT_ANALYTICS_KEY;
const AZURE_TEXT_ANALYTICS_ENDPOINT = process.env.AZURE_TEXT_ANALYTICS_ENDPOINT || 'https://your-resource-name.cognitiveservices.azure.com/';

/**
 * Analyze sentiment of text using Azure Text Analytics
 * @param {string} text - Text to analyze
 * @param {string} language - Language code (optional)
 * @returns {Promise<Object>} Sentiment analysis result
 */
export const analyzeSentiment = async (text, language = '') => {
  if (!AZURE_TEXT_ANALYTICS_KEY) {
    throw new Error('Azure Text Analytics API key not found');
  }

  try {
    const response = await axios({
      baseURL: AZURE_TEXT_ANALYTICS_ENDPOINT,
      url: '/text/analytics/v3.1/sentiment',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_TEXT_ANALYTICS_KEY,
        'Content-type': 'application/json',
      },
      data: {
        'documents': [
          {
            'id': '1',
            'language': language || 'en',
            'text': text
          }
        ]
      },
      responseType: 'json'
    });

    return response.data.documents[0];
  } catch (error) {
    console.error('Error analyzing sentiment with Azure:', error);
    throw error;
  }
};

/**
 * Extract key phrases from text using Azure Text Analytics
 * @param {string} text - Text to analyze
 * @param {string} language - Language code (optional)
 * @returns {Promise<string[]>} Array of key phrases
 */
export const extractKeyPhrases = async (text, language = '') => {
  if (!AZURE_TEXT_ANALYTICS_KEY) {
    throw new Error('Azure Text Analytics API key not found');
  }

  try {
    const response = await axios({
      baseURL: AZURE_TEXT_ANALYTICS_ENDPOINT,
      url: '/text/analytics/v3.1/keyPhrases',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_TEXT_ANALYTICS_KEY,
        'Content-type': 'application/json',
      },
      data: {
        'documents': [
          {
            'id': '1',
            'language': language || 'en',
            'text': text
          }
        ]
      },
      responseType: 'json'
    });

    return response.data.documents[0].keyPhrases;
  } catch (error) {
    console.error('Error extracting key phrases with Azure:', error);
    throw error;
  }
};

/**
 * Recognize legal entities in text using Azure Text Analytics
 * @param {string} text - Text to analyze
 * @param {string} language - Language code (optional)
 * @returns {Promise<Object[]>} Array of recognized entities
 */
export const recognizeEntities = async (text, language = '') => {
  if (!AZURE_TEXT_ANALYTICS_KEY) {
    throw new Error('Azure Text Analytics API key not found');
  }

  try {
    const response = await axios({
      baseURL: AZURE_TEXT_ANALYTICS_ENDPOINT,
      url: '/text/analytics/v3.1/entities/recognition/general',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_TEXT_ANALYTICS_KEY,
        'Content-type': 'application/json',
      },
      data: {
        'documents': [
          {
            'id': '1',
            'language': language || 'en',
            'text': text
          }
        ]
      },
      responseType: 'json'
    });

    return response.data.documents[0].entities;
  } catch (error) {
    console.error('Error recognizing entities with Azure:', error);
    throw error;
  }
};

/**
 * Generate a legal response based on entity extraction and key phrases
 * @param {string} userQuery - User's legal query
 * @param {string} language - Language code
 * @returns {Promise<string>} Generated response
 */
export const generateLegalResponse = async (userQuery, language = 'en') => {
  try {
    // Step 1: Extract key phrases to understand the main topics
    const keyPhrases = await extractKeyPhrases(userQuery, language);
    
    // Step 2: Recognize entities to identify specific legal terms
    const entities = await recognizeEntities(userQuery, language);
    
    // Step 3: Analyze sentiment to gauge user concern level
    const sentiment = await analyzeSentiment(userQuery, language);
    
    // Now we have rich information to enhance the response
    // This would typically connect to a legal database or AI model
    // For demonstration, we'll return a structured analysis
    return {
      keyPhrases,
      entities,
      sentiment: sentiment.sentiment,
      confidenceScores: sentiment.confidenceScores
    };
  } catch (error) {
    console.error('Error generating legal response with Azure:', error);
    throw error;
  }
};

export default {
  analyzeSentiment,
  extractKeyPhrases,
  recognizeEntities,
  generateLegalResponse
};
