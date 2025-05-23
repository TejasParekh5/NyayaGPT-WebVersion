// server.js
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { dirname } from 'path';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { SpeechClient } from '@google-cloud/speech';
import fetch from 'node-fetch';
import axios from 'axios';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // In production, you would restrict this to your frontend domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Create directory for audio files if it doesn't exist
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const audioDir = path.join(__dirname, 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir);
}

// Bhashini API configuration
const BHASHINI_UDYAT_KEY = process.env.BHASHINI_UDYAT_KEY;
const BHASHINI_INFERENCE_API_KEY = process.env.BHASHINI_INFERENCE_API_KEY;
const BHASHINI_API_URL = process.env.BHASHINI_API_URL || 'https://bhashini.gov.in/api';

// Bhashini API helper functions
const getBhashiniConfig = async () => {
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

// Convert speech to text using Bhashini API
const bhashiniSpeechToText = async (audioData, language, autoDetect = false) => {
  try {
    // Get language code in the format Bhashini expects
    const languageCode = getBhashiniLanguageCode(language);
    
    // Prepare request body based on whether we want auto-detection
    const requestBody = {
      audio: audioData,
      apiKey: BHASHINI_INFERENCE_API_KEY,
    };
    
    // If not auto-detecting, specify the language
    if (!autoDetect) {
      requestBody.language = languageCode;
    } else {
      // Set auto-detection flag (adjust as needed for actual Bhashini API)
      requestBody.autoDetectLanguage = true;
    }
    
    // Call Bhashini ASR (Automatic Speech Recognition) API
    const response = await axios.post(`${BHASHINI_API_URL}/asr`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': BHASHINI_UDYAT_KEY
      }
    });
    
    // Return both the recognized text and detected language (if available)
    const result = {
      text: response.data.text || ''
    };
    
    if (response.data.detectedLanguage) {
      result.detectedLanguage = response.data.detectedLanguage;
    }
    
    return result;
  } catch (error) {
    console.error('Error in Bhashini speech-to-text:', error);
    throw error;
  }
};

// Convert text to speech using Bhashini API
const bhashiniTextToSpeech = async (text, language, gender = 'female', rate = 1.0, pitch = 1.0) => {
  try {
    // Get language code in the format Bhashini expects
    const languageCode = getBhashiniLanguageCode(language);
    
    // Call Bhashini TTS (Text-to-Speech) API with enhanced parameters
    const response = await axios.post(`${BHASHINI_API_URL}/tts`, {
      input: text,
      language: languageCode,
      apiKey: BHASHINI_INFERENCE_API_KEY,
      gender: gender,
      // Bhashini-specific parameters (may need adjustment based on actual API)
      speed: rate,
      pitch: pitch
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

// Helper function to convert language codes
const getBhashiniLanguageCode = (languageCode) => {
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
  
  return languageMap[languageCode] || 'en';
};

// Simple in-memory database for legal information (replace with a real database in production)
const legalDatabase = {
  "FIR": "To file an FIR (First Information Report) in India, visit your local police station. Provide details about the incident, including time, place, and persons involved. The police are obligated to register your FIR for cognizable offenses. You can also file an e-FIR on your state police website for certain types of cases.",
  "arrest rights": "If arrested in India, you have the right to know the grounds of arrest, the right to legal representation, the right to inform a relative/friend, the right to be produced before a magistrate within 24 hours, the right to bail (for bailable offenses), protection from torture, and the right to a fair trial.",
  "legal aid": "To apply for free legal aid in India, contact your nearest District Legal Services Authority (DLSA) or State Legal Services Authority (SLSA). Eligibility includes women, children, persons with disabilities, victims of trafficking, SC/ST individuals, industrial workmen, and persons with annual income below the specified limit.",
  "consumer complaint": "To file a consumer complaint in India: 1) Write a formal complaint letter to the business first. 2) If unsatisfied, file a complaint with the appropriate Consumer Disputes Redressal Commission based on the claim amount. 3) Submit required documents including proof of transaction. 4) Pay the nominal filing fees. 5) Attend hearings as scheduled.",
  "property registration": "Documents needed for property registration in India include the sale deed, property title documents, NOC from housing society (if applicable), construction approval plans, land use conversion certificate (if applicable), tax receipts, identity proofs of parties, and photographs.",
};

// Chat Endpoint
app.post('/chat', (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase();
    let reply = "I'm sorry, I don't have information on that topic yet. Please try asking about FIR filing, arrest rights, legal aid, consumer complaints, or property registration.";
    
    // Simple keyword matching (replace with more sophisticated NLP in production)
    Object.entries(legalDatabase).forEach(([keyword, info]) => {
      if (userMessage.includes(keyword.toLowerCase())) {
        reply = info;
      }
    });
    
    res.json({ reply });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Speech-to-Text endpoint
app.post('/speech-to-text', async (req, res) => {
  try {
    // Check if this is a simulated request (no audio data)
    if (req.body.simulatedRequest) {
      console.log("Handling simulated speech recognition request");
      
      // Generate simulated response based on language
      let simulatedText = "How do I file an FIR?"; // Default English
      let detectedLanguage = null;
      const lang = req.body.language || 'en';
      const autoDetect = req.body.autoDetectLanguage || false;
      
      if (lang === 'hi') {
        simulatedText = "मुझे FIR दर्ज करने के बारे में जानकारी चाहिए";
      } else if (lang === 'ta') {
        simulatedText = "FIR பதிவு செய்வது எப்படி?";
      }
      
      // Simulate language detection for demonstration
      if (autoDetect) {
        // In a real implementation, this would be determined by the API
        // Here we're just simulating a detected language
        detectedLanguage = Math.random() > 0.5 ? 'hi' : 'en';
        if (detectedLanguage === 'hi') {
          simulatedText = "मुझे FIR दर्ज करने के बारे में जानकारी चाहिए";
        }
      }
      
      // Simulate processing delay
      setTimeout(() => {
        res.json({ 
          text: simulatedText,
          detectedLanguage: autoDetect ? detectedLanguage : null
        });
      }, 1000);
      return;
    }
    
    // Real speech recognition request
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Using Google Speech API
      const speechClient = new SpeechClient();
      const audio = req.body.audio; // Base64 encoded audio
      const audioBuffer = Buffer.from(audio, 'base64');
      
      const request = {
        audio: {
          content: audioBuffer.toString('base64'),
        },
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: req.body.language || 'en-IN',
        },
      };
      
      const [response] = await speechClient.recognize(request);
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      
      res.json({ text: transcription });    } else if (BHASHINI_UDYAT_KEY && BHASHINI_INFERENCE_API_KEY) {
      // Using Bhashini API
      console.log("Using Bhashini API for speech recognition");
      const audio = req.body.audio; // Base64 encoded audio
      const language = req.body.language || 'en';
      const autoDetect = req.body.autoDetectLanguage || false;
      
      try {
        const result = await bhashiniSpeechToText(audio, language, autoDetect);
        
        // Return both the text and detected language (if available)
        const response = { text: result.text };
        if (result.detectedLanguage) {
          response.detectedLanguage = result.detectedLanguage;
        }
        
        res.json(response);
      } catch (bhashiniError) {
        console.error('Bhashini API error:', bhashiniError);
        // Fallback to simulation if Bhashini API fails
        const simulatedText = language === 'hi' 
          ? "मुझे FIR दर्ज करने के बारे में जानकारी चाहिए" 
          : "How do I file an FIR?";
        
        // If auto-detection was requested, also return a simulated detected language
        const response = { text: simulatedText };
        if (autoDetect) {
          response.detectedLanguage = Math.random() > 0.5 ? 'hi' : 'en';
        }
        
        res.json(response);
      }
    } else {
      // No API credentials available - simulate
      console.log("No API credentials available, using simulation");
      let simulatedText = "How do I file an FIR?";
      const lang = req.body.language || 'en';
      
      if (lang === 'hi') {
        simulatedText = "मुझे FIR दर्ज करने के बारे में जानकारी चाहिए";
      } else if (lang === 'ta') {
        simulatedText = "FIR பதிவு செய்வது எப்படி?";
      }
      
      setTimeout(() => {
        res.json({ text: simulatedText });
      }, 1000);
    }
  } catch (error) {
    console.error('Error in speech-to-text endpoint:', error);
    res.status(500).json({ error: 'Speech recognition failed' });
  }
});

// Text-to-Speech endpoint
app.post('/text-to-speech', async (req, res) => {
  try {
    const { text, language, voiceGender = 'female', speechRate = 1.0, speechPitch = 1.0, speechVolume = 1.0 } = req.body;
    const languageCode = language || 'en';
    
    // Check which API to use
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Using Google Text-to-Speech
      const ttsClient = new TextToSpeechClient();
      
      const request = {
        input: { text },
        voice: { 
          languageCode: `${languageCode}-IN`, 
          ssmlGender: voiceGender === 'male' ? 'MALE' : 'FEMALE'
        },
        audioConfig: { 
          audioEncoding: 'MP3',
          speakingRate: parseFloat(speechRate),
          pitch: parseFloat(speechPitch),
          volumeGainDb: parseFloat(speechVolume) * 10 - 10 // Convert 0-1 range to dB (-10 to 0)
        },
      };
      
      const [response] = await ttsClient.synthesizeSpeech(request);
      const audioContent = response.audioContent;
      
      // Generate unique filename
      const filename = `speech-${Date.now()}.mp3`;
      const audioPath = path.join(audioDir, filename);
      
      // Write audio to file
      fs.writeFileSync(audioPath, audioContent);
      
      // Send the URL to the audio file
      res.json({ audioUrl: `/audio/${filename}` });
    } else if (BHASHINI_UDYAT_KEY && BHASHINI_INFERENCE_API_KEY) {
      // Using Bhashini API
      console.log("Using Bhashini API for text-to-speech");
      
      try {
        // Get audio content from Bhashini API with enhanced parameters
        const audioContent = await bhashiniTextToSpeech(
          text, 
          languageCode, 
          voiceGender, 
          speechRate,
          speechPitch
        );
        
        // Generate unique filename
        const filename = `bhashini-speech-${Date.now()}.mp3`;
        const audioPath = path.join(audioDir, filename);
        
        // Write audio to file
        fs.writeFileSync(audioPath, audioContent);
        
        // Send the URL to the audio file
        res.json({ audioUrl: `/audio/${filename}` });
      } catch (bhashiniError) {
        console.error('Bhashini API error:', bhashiniError);
        // Fallback to sample audio if Bhashini API fails
        res.json({ audioUrl: `/audio/sample-audio.mp3` });
      }
    } else {
      // For development without credentials, use a static sample audio file
      console.log("Using fallback TTS simulation");
      
      // Create a simple audio file if it doesn't exist
      const sampleAudioPath = path.join(audioDir, 'sample-audio.mp3');
      if (!fs.existsSync(sampleAudioPath)) {
        // Create an empty file as placeholder (you'd want a real MP3 file here)
        fs.writeFileSync(sampleAudioPath, '');
        console.log("Created placeholder audio file. Replace with real MP3 for proper testing.");
      }
      
      // Send the URL to the static audio file
      setTimeout(() => {
        res.json({ audioUrl: `/audio/sample-audio.mp3` });
      }, 1000);
    }
  } catch (error) {
    console.error('Error in text-to-speech endpoint:', error);
    res.status(500).json({ error: 'Text-to-speech conversion failed' });
  }
});

// Serve audio files
app.use('/audio', express.static(audioDir));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});