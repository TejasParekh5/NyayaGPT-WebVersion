// Azure Speech Service
// This service provides speech-to-text and text-to-speech capabilities using Azure Cognitive Services
// It serves as a fallback when Bhashini API is unavailable

import axios from 'axios';
import dotenv from 'dotenv';
import { Buffer } from 'buffer';

dotenv.config();

// Azure Speech Service configuration
const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'eastus';
const AZURE_SPEECH_ENDPOINT = `https://${AZURE_SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`;

// Language code mapping for Azure Speech
const azureSpeechLanguageMap = {
  'en': 'en-IN',  // English (India)
  'hi': 'hi-IN',  // Hindi
  'bn': 'bn-IN',  // Bengali
  'ta': 'ta-IN',  // Tamil
  'te': 'te-IN',  // Telugu
  'kn': 'kn-IN',  // Kannada
  'ml': 'ml-IN',  // Malayalam
  'mr': 'mr-IN',  // Marathi
  'gu': 'gu-IN',  // Gujarati
  'pa': 'pa-IN'   // Punjabi
};

// Voice mapping for text-to-speech
const azureVoiceMap = {
  'en': {
    'female': 'en-IN-NeerjaNeural',
    'male': 'en-IN-PrabhatNeural'
  },
  'hi': {
    'female': 'hi-IN-SwaraNeural',
    'male': 'hi-IN-MadhurNeural'
  },
  'bn': {
    'female': 'bn-IN-TanishaaNeural',
    'male': 'bn-IN-BashkarNeural'
  },
  'ta': {
    'female': 'ta-IN-PallaviNeural',
    'male': 'ta-IN-ValluvarNeural'
  },
  'te': {
    'female': 'te-IN-ShrutiNeural',
    'male': 'te-IN-MohanNeural'
  },
  'kn': {
    'female': 'kn-IN-SapnaNeural',
    'male': 'kn-IN-GaganNeural'
  },
  'ml': {
    'female': 'ml-IN-SobhanaNeural',
    'male': 'ml-IN-MidhunNeural'
  },
  'mr': {
    'female': 'mr-IN-AarohiNeural',
    'male': 'mr-IN-ManoharNeural'
  },
  'gu': {
    'female': 'gu-IN-DhwaniNeural',
    'male': 'gu-IN-NiranjanNeural'
  },
  'pa': {
    'female': 'pa-IN-GurleenNeural',
    'male': 'pa-IN-SukhcharNeural'
  }
};

/**
 * Get an access token for Azure Speech Services
 * @returns {Promise<string>} Azure Speech access token
 */
const getAzureSpeechToken = async () => {
  if (!AZURE_SPEECH_KEY) {
    throw new Error('Azure Speech API key not found');
  }

  try {
    const response = await axios({
      url: AZURE_SPEECH_ENDPOINT,
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting Azure Speech token:', error);
    throw error;
  }
};

/**
 * Convert speech to text using Azure Speech Services
 * @param {Buffer|string} audioData - Audio data as buffer or base64 string
 * @param {string} language - Language code
 * @returns {Promise<string>} Transcribed text
 */
export const speechToText = async (audioData, language = 'en') => {
  if (!AZURE_SPEECH_KEY) {
    throw new Error('Azure Speech API key not found');
  }

  try {
    // Convert base64 string to buffer if needed
    const audioBuffer = typeof audioData === 'string' 
      ? Buffer.from(audioData, 'base64') 
      : audioData;
    
    // Get language code in the format Azure expects
    const languageCode = azureSpeechLanguageMap[language] || 'en-IN';
    
    // Get Azure Speech token
    const token = await getAzureSpeechToken();
    
    // Call Azure Speech-to-Text REST API
    const response = await axios({
      baseURL: `https://${AZURE_SPEECH_REGION}.stt.speech.microsoft.com`,
      url: '/speech/recognition/conversation/cognitiveservices/v1',
      method: 'post',
      headers: {
        'Content-Type': 'audio/wav',
        'Authorization': `Bearer ${token}`,
        'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY
      },
      params: {
        'language': languageCode,
        'format': 'detailed'
      },
      data: audioBuffer
    });
    
    return response.data.DisplayText || '';
  } catch (error) {
    console.error('Error in Azure speech-to-text:', error);
    throw error;
  }
};

/**
 * Convert text to speech using Azure Speech Services
 * @param {string} text - Text to convert to speech
 * @param {string} language - Language code
 * @param {string} gender - Voice gender ('male' or 'female')
 * @returns {Promise<Buffer>} Audio data as buffer
 */
export const textToSpeech = async (text, language = 'en', gender = 'female') => {
  if (!AZURE_SPEECH_KEY) {
    throw new Error('Azure Speech API key not found');
  }

  try {
    // Get language code and voice name in the format Azure expects
    const voiceName = azureVoiceMap[language]?.[gender] || azureVoiceMap['en'][gender];
    
    // Get Azure Speech token
    const token = await getAzureSpeechToken();
    
    // Create SSML for text-to-speech
    const ssml = `
      <speak version='1.0' xml:lang='${azureSpeechLanguageMap[language] || 'en-IN'}'>
        <voice name='${voiceName}'>
          ${text}
        </voice>
      </speak>
    `;
    
    // Call Azure Text-to-Speech REST API
    const response = await axios({
      baseURL: `https://${AZURE_SPEECH_REGION}.tts.speech.microsoft.com`,
      url: '/cognitiveservices/v1',
      method: 'post',
      headers: {
        'Content-Type': 'application/ssml+xml',
        'Authorization': `Bearer ${token}`,
        'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
      },
      data: ssml,
      responseType: 'arraybuffer'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error in Azure text-to-speech:', error);
    throw error;
  }
};

export default {
  speechToText,
  textToSpeech
};
