// bhashiniService.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Bhashini API configuration
const BHASHINI_UDYAT_KEY = process.env.BHASHINI_UDYAT_KEY || '044ead971c-2c3c-4043-89e9-45e154285b18'; // Default from screenshot
const BHASHINI_INFERENCE_API_KEY = process.env.BHASHINI_INFERENCE_API_KEY || 'ur_lB-PKydyLBVz21RlFTLpSqRyuUslBSRf-G8byTEgXPS-dnB1B6VMhA61Ljal7'; // Default from screenshot
const BHASHINI_API_URL = process.env.BHASHINI_API_URL || 'https://bhashini.gov.in/api';

// Language code mapping
const languageMap = {
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
 * Get Bhashini API configuration
 * @returns {Promise<Object>} Bhashini API configuration
 */
export const getBhashiniConfig = async () => {
  try {
    const configResponse = await axios.get(`${BHASHINI_API_URL}/config`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': BHASHINI_UDYAT_KEY,
        'userID': 'nyayagpt-user'
      }
    });
    return configResponse.data;
  } catch (error) {
    console.error('Error fetching Bhashini config:', error);
    throw error;
  }
};

/**
 * Convert speech to text using Bhashini API
 * @param {string} audioData - Base64 encoded audio data
 * @param {string} language - Language code
 * @returns {Promise<string>} Transcribed text
 */
export const speechToText = async (audioData, language) => {
  try {
    // Get language code in the format Bhashini expects
    const languageCode = languageMap[language] || 'en';
    
    // Call Bhashini ASR (Automatic Speech Recognition) API
    const response = await axios.post(`${BHASHINI_API_URL}/asr`, {
      audio: audioData,
      language: languageCode,
      apiKey: BHASHINI_INFERENCE_API_KEY
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': BHASHINI_UDYAT_KEY
      }
    });
    
    return response.data.text || '';
  } catch (error) {
    console.error('Error in Bhashini speech-to-text:', error);
    throw error;
  }
};

/**
 * Convert text to speech using Bhashini API
 * @param {string} text - Text to convert to speech
 * @param {string} language - Language code
 * @returns {Promise<Buffer>} Audio data
 */
export const textToSpeech = async (text, language) => {
  try {
    // Get language code in the format Bhashini expects
    const languageCode = languageMap[language] || 'en';
    
    // Call Bhashini TTS (Text-to-Speech) API
    const response = await axios.post(`${BHASHINI_API_URL}/tts`, {
      input: text,
      language: languageCode,
      apiKey: BHASHINI_INFERENCE_API_KEY,
      gender: 'female' // Or 'male', depending on preference
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': BHASHINI_UDYAT_KEY
      },
      responseType: 'arraybuffer' // For binary audio data
    });
    
    return response.data;
  } catch (error) {
    console.error('Error in Bhashini text-to-speech:', error);
    throw error;
  }
};

/**
 * Translate text using Bhashini API
 * @param {string} text - Text to translate
 * @param {string} sourceLanguage - Source language code
 * @param {string} targetLanguage - Target language code
 * @returns {Promise<string>} Translated text
 */
export const translateText = async (text, sourceLanguage, targetLanguage) => {
  try {
    // If source and target languages are the same, return the original text
    if (sourceLanguage === targetLanguage) {
      return text;
    }
    
    const sourceLang = languageMap[sourceLanguage] || 'en';
    const targetLang = languageMap[targetLanguage] || 'en';
    
    console.log(`Translating text from ${sourceLang} to ${targetLang}`);
    
    // Call Bhashini Translation API
    const response = await axios.post(`${BHASHINI_API_URL}/translate`, {
      input: text,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      apiKey: BHASHINI_INFERENCE_API_KEY
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': BHASHINI_UDYAT_KEY
      }
    });
    
    const translatedText = response.data.output || text;
    console.log(`Translation complete: ${text.substring(0, 30)}... -> ${translatedText.substring(0, 30)}...`);
    
    return translatedText;
  } catch (error) {
    console.error('Error in Bhashini translation:', error);
    throw error;
  }
};

/**
 * Detect the language of a text
 * @param {string} text - Text to detect language for
 * @returns {Promise<string>} Detected language code
 */
export const detectLanguage = async (text) => {
  try {
    // Call Bhashini Language Detection API
    const response = await axios.post(`${BHASHINI_API_URL}/language-detection`, {
      input: text,
      apiKey: BHASHINI_INFERENCE_API_KEY
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': BHASHINI_UDYAT_KEY
      }
    });
    
    // Return detected language code or fallback to English
    return response.data.detectedLanguage || 'en';
  } catch (error) {
    console.error('Error in Bhashini language detection:', error);
    
    // Simple fallback language detection for common Indian languages
    if (/[\u0900-\u097F]/.test(text)) return 'hi'; // Hindi
    if (/[\u0980-\u09FF]/.test(text)) return 'bn'; // Bengali
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'; // Tamil
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te'; // Telugu
    
    return 'en'; // Default to English
  }
};

/**
 * Generate a response using Bhashini NLP API
 * @param {string} query - User query
 * @param {string} language - Language code
 * @returns {Promise<string>} Generated response
 */
export const generateResponse = async (query, language = 'en') => {
  try {
    // First try to detect the actual language of the query
    let detectedLanguage = language;
    try {
      detectedLanguage = await detectLanguage(query);
      console.log(`Detected language: ${detectedLanguage}`);
    } catch (detectionError) {
      console.error('Error detecting language, using provided language:', language);
    }

    // Use the detected or provided language code
    const languageCode = languageMap[detectedLanguage] || 'en';
    console.log(`Using language code: ${languageCode} for processing`);
    
    // First translate the query to English if it's not already in English
    let englishQuery = query;
    if (languageCode !== 'en') {
      try {
        console.log(`Translating query to English: ${query}`);
        englishQuery = await translateText(query, detectedLanguage, 'en');
        console.log(`Translated query: ${englishQuery}`);
      } catch (translateError) {
        console.error('Error translating query to English:', translateError);
        // Continue with original query if translation fails
      }
    }
    
    // Try to call Bhashini NLP API for legal response generation
    try {
      const response = await axios.post(`${BHASHINI_API_URL}/nlp`, {
        input: englishQuery,
        task: 'question-answering',
        domain: 'legal', 
        apiKey: BHASHINI_INFERENCE_API_KEY,
        language: 'en' // Process in English for better accuracy
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': BHASHINI_UDYAT_KEY
        },
        timeout: 10000 // 10-second timeout
      });
      
      if (response.data && response.data.answer) {
        let answer = response.data.answer;
        
        // Translate the answer back to the original language if needed
        if (languageCode !== 'en') {
          try {
            console.log(`Translating answer back to ${languageCode}`);
            answer = await translateText(answer, 'en', detectedLanguage);
          } catch (translateError) {
            console.error('Error translating response to target language:', translateError);
            // Return English answer if translation fails
          }
        }
        
        return answer;
      }
    } catch (nlpError) {
      console.error('Error calling Bhashini NLP API:', nlpError);
      // Continue to fallback
    }
    
    // Fallback response generation based on keyword matching
    console.log('Using fallback response generation');
    
    // Default fallback messages in different languages
    const fallbackMessages = {
      'en': "I'm sorry, I don't have information on that specific topic yet. Please try asking about FIR filing, arrest rights, legal aid, consumer complaints, or property registration.",
      'hi': "मुझे इस विशिष्ट विषय पर जानकारी नहीं है। कृपया एफआईआर दर्ज करने, गिरफ्तारी अधिकारों, कानूनी सहायता, उपभोक्ता शिकायत, या संपत्ति पंजीकरण के बारे में पूछें।",
      'bn': "আমি এই নির্দিষ্ট বিষয়ে এখনও তথ্য রাখি না। অনুগ্রহ করে এফআইআর দাখিল, গ্রেপ্তারের অধিকার, আইনি সহায়তা, ভোক্তা অভিযোগ, বা সম্পত্তি নিবন্ধন সম্পর্কে জিজ্ঞাসা করুন।",
      'ta': "இந்த குறிப்பிட்ட தலைப்பில் எனக்கு இன்னும் தகவல் இல்லை. FIR பதிவு, கைது உரிமைகள், சட்ட உதவி, நுகர்வோர் புகார் அல்லது சொத்து பதிவு பற்றி கேட்க முயற்சிக்கவும்.",
      'te': "ఈ నిర్దిష్ట అంశంపై నాకు ఇంకా సమాచారం లేదు. దయచేసి FIR దాఖలు, అరెస్ట్ హక్కులు, చట్ట సహాయం, వినియోగదారు ఫిర్యాదులు లేదా ఆస్తి నమోదు గురించి అడగండి."
    };
    
    // Return fallback message in the appropriate language
    const fallbackLanguage = languageCode in fallbackMessages ? languageCode : 'en';
    return fallbackMessages[fallbackLanguage];
  } catch (error) {
    console.error('Error generating response with Bhashini:', error);
    
    // If all else fails, return a simple error message in English
    return "I'm sorry, I'm having trouble processing your request. Please try again later.";
  }
};
