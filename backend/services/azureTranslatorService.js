// Azure Translator Service
// This service provides text translation capabilities using Azure Cognitive Services
// It serves as a fallback when Bhashini API is unavailable

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Azure Translator configuration
const AZURE_TRANSLATOR_KEY = process.env.AZURE_TRANSLATOR_KEY;
const AZURE_TRANSLATOR_REGION = process.env.AZURE_TRANSLATOR_REGION || 'eastus';
const AZURE_TRANSLATOR_ENDPOINT = process.env.AZURE_TRANSLATOR_ENDPOINT || 'https://api.cognitive.microsofttranslator.com/';

// Map of language codes for Azure Translator
const azureLanguageMap = {
  'en': 'en',
  'hi': 'hi',
  'bn': 'bn',
  'ta': 'ta',
  'te': 'te',
  'kn': 'kn',
  'ml': 'ml',
  'mr': 'mr',
  'gu': 'gu',
  'pa': 'pa'
};

/**
 * Detect the language of input text using Azure Translator
 * @param {string} text - Text to detect language for
 * @returns {Promise<string>} Detected language code
 */
export const detectLanguage = async (text) => {
  if (!AZURE_TRANSLATOR_KEY) {
    throw new Error('Azure Translator API key not found');
  }

  try {
    const response = await axios({
      baseURL: AZURE_TRANSLATOR_ENDPOINT,
      url: '/detect',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
        'Ocp-Apim-Subscription-Region': AZURE_TRANSLATOR_REGION,
        'Content-type': 'application/json',
      },
      params: {
        'api-version': '3.0'
      },
      data: [{
        'text': text
      }],
      responseType: 'json'
    });

    return response.data[0].language;
  } catch (error) {
    console.error('Error detecting language with Azure:', error);
    throw error;
  }
};

/**
 * Translate text using Azure Translator
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code (optional)
 * @returns {Promise<string>} Translated text
 */
export const translateText = async (text, targetLanguage, sourceLanguage = '') => {
  if (!AZURE_TRANSLATOR_KEY) {
    throw new Error('Azure Translator API key not found');
  }

  // Map to Azure language codes
  const target = azureLanguageMap[targetLanguage] || 'en';
  const source = sourceLanguage ? azureLanguageMap[sourceLanguage] : '';

  try {
    const response = await axios({
      baseURL: AZURE_TRANSLATOR_ENDPOINT,
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
        'Ocp-Apim-Subscription-Region': AZURE_TRANSLATOR_REGION,
        'Content-type': 'application/json',
      },
      params: {
        'api-version': '3.0',
        'to': target,
        'from': source
      },
      data: [{
        'text': text
      }],
      responseType: 'json'
    });

    return response.data[0].translations[0].text;
  } catch (error) {
    console.error('Error translating with Azure:', error);
    throw error;
  }
};

/**
 * Batch translate multiple texts using Azure Translator
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code (optional)
 * @returns {Promise<string[]>} Array of translated texts
 */
export const batchTranslate = async (texts, targetLanguage, sourceLanguage = '') => {
  if (!AZURE_TRANSLATOR_KEY) {
    throw new Error('Azure Translator API key not found');
  }

  // Map to Azure language codes
  const target = azureLanguageMap[targetLanguage] || 'en';
  const source = sourceLanguage ? azureLanguageMap[sourceLanguage] : '';

  try {
    const data = texts.map(text => ({ 'text': text }));
    const response = await axios({
      baseURL: AZURE_TRANSLATOR_ENDPOINT,
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_TRANSLATOR_KEY,
        'Ocp-Apim-Subscription-Region': AZURE_TRANSLATOR_REGION,
        'Content-type': 'application/json',
      },
      params: {
        'api-version': '3.0',
        'to': target,
        'from': source
      },
      data: data,
      responseType: 'json'
    });

    return response.data.map(item => item.translations[0].text);
  } catch (error) {
    console.error('Error batch translating with Azure:', error);
    throw error;
  }
};

export default {
  detectLanguage,
  translateText,
  batchTranslate
};
