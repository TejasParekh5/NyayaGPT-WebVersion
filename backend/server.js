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
const BHASHINI_UDYAT_KEY = "044ead971c-2c3c-4043-89e9-45e154285b18"; // Use the key from the screenshot
const BHASHINI_INFERENCE_API_KEY = "ur_iB-PKydyLBVz2tRlFTLp5qRyUslBSRf-G8byTEgXPS-dnB1B6VMhA61Ljal7"; // Use the key from the screenshot
const BHASHINI_API_URL = "https://meity-auth.ulcacontrib.org";  // Updated API URL

// Max retries for API calls
const MAX_API_RETRIES = 3;

// Bhashini API helper functions
const getBhashiniConfig = async () => {
  try {
    const configResponse = await axios.post(`${BHASHINI_API_URL}/ulca/apis/v0/model/getModelsPipeline`, {
      pipelineTasks: [
        {
          taskType: "asr",
          config: {
            language: {
              sourceLanguage: "en"
            }
          }
        }
      ],
      pipelineRequestConfig: {
        pipelineId: "64392f96daac500b55c543cd"
      }
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'ulcaApiKey': BHASHINI_UDYAT_KEY,
        'userID': 'nyayagpt-user'
      }
    });
    return configResponse.data;
  } catch (error) {
    console.error('Error fetching Bhashini config:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

// Convert speech to text using Bhashini API
const bhashiniSpeechToText = async (audioData, language) => {
  // Track retries
  let retries = 0;
  
  while (retries < MAX_API_RETRIES) {
    try {
      // Get language code in the format Bhashini expects
      const languageCode = getBhashiniLanguageCode(language);
      
      // Choose appropriate service ID based on language
      let serviceId = "ai4bharat/conformer-multilingual-chitralekha-gov";
      
      const payload = {
        pipelineTasks: [
          {
            taskType: "asr",
            config: {
              language: {
                sourceLanguage: languageCode
              },
              serviceId: serviceId,
              audioFormat: "wav",
              samplingRate: 16000
            }
          }
        ],
        inputData: {
          audio: [
            {
              audioContent: audioData
            }
          ]
        }
      };
      
      console.log(`Attempt ${retries + 1} to call Bhashini ASR API`);
      
      // First, get compute instance details for processing
      const computeInstanceResponse = await axios.post(
        `${BHASHINI_API_URL}/ulca/apis/v0/model/compute`,
        {
          modelId: serviceId,
          task: "asr",
          userId: "nyayagpt-user"
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'ulcaApiKey': BHASHINI_UDYAT_KEY
          },
          timeout: 30000,
          validateStatus: false
        }
      );
      
      if (computeInstanceResponse.status >= 400) {
        console.error(`HTTP error ${computeInstanceResponse.status} from Bhashini Compute API`);
        throw new Error(`HTTP error ${computeInstanceResponse.status} from compute endpoint`);
      }
      
      const computeInstance = computeInstanceResponse.data;
      console.log("Compute instance details:", JSON.stringify(computeInstance, null, 2));
      
      if (!computeInstance.callbackUrl) {
        throw new Error("No callback URL in compute instance response");
      }
      
      // Now make the actual ASR request to the compute instance
      const response = await axios.post(computeInstance.callbackUrl, payload, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': BHASHINI_INFERENCE_API_KEY
        },
        timeout: 60000,
        validateStatus: false // Don't throw error on non-2xx responses
      });
      
      // Check if response has the correct content type (JSON)
      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes('application/json')) {
        console.error(`Invalid content type: ${contentType}, Status: ${response.status}`);
        const errorMessage = typeof response.data === 'string' ? response.data.substring(0, 500) : 'Unknown error';
        console.error(`Error response: ${errorMessage}`);
        throw new Error(`Received non-JSON response: ${contentType}`);
      }
      
      // Check for HTTP errors
      if (response.status >= 400) {
        console.error(`HTTP error ${response.status} from Bhashini API`);
        throw new Error(`HTTP error ${response.status}`);
      }
      
      console.log("Bhashini ASR response:", JSON.stringify(response.data, null, 2));
      
      if (response.data && 
          response.data.pipelineResponse && 
          response.data.pipelineResponse[0] && 
          response.data.pipelineResponse[0].output && 
          response.data.pipelineResponse[0].output[0] && 
          response.data.pipelineResponse[0].output[0].source) {
        return response.data.pipelineResponse[0].output[0].source;
      } else {
        console.error("Unexpected response structure from Bhashini ASR");
        throw new Error("Invalid response structure from Bhashini ASR");
      }
    } catch (error) {
      console.error(`Error in Bhashini speech-to-text (attempt ${retries + 1}):`, error);
      
      // Increment retry counter
      retries++;
      
      // If we've hit the max retries, re-throw the error
      if (retries >= MAX_API_RETRIES) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
};

// Convert text to speech using Bhashini API
const bhashiniTextToSpeech = async (text, language) => {
  // Track retries
  let retries = 0;
  
  while (retries < MAX_API_RETRIES) {
    try {
      // Get language code in the format Bhashini expects
      const languageCode = getBhashiniLanguageCode(language);
      
      // Choose appropriate service ID based on language
      let serviceId = "ai4bharat/indic-tts";
      let gender = "female";
      
      const payload = {
        pipelineTasks: [
          {
            taskType: "tts",
            config: {
              language: {
                sourceLanguage: languageCode
              },
              gender: gender,
              serviceId: serviceId
            }
          }
        ],
        inputData: {
          text: [
            {
              source: text
            }
          ]
        }
      };
      
      console.log(`Attempt ${retries + 1} to call Bhashini TTS API`);
      
      // First, get compute instance details for processing
      const computeInstanceResponse = await axios.post(
        `${BHASHINI_API_URL}/ulca/apis/v0/model/compute`,
        {
          modelId: serviceId,
          task: "tts",
          userId: "nyayagpt-user"
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'ulcaApiKey': BHASHINI_UDYAT_KEY
          },
          timeout: 30000,
          validateStatus: false
        }
      );
      
      if (computeInstanceResponse.status >= 400) {
        console.error(`HTTP error ${computeInstanceResponse.status} from Bhashini Compute API`);
        throw new Error(`HTTP error ${computeInstanceResponse.status} from compute endpoint`);
      }
      
      const computeInstance = computeInstanceResponse.data;
      console.log("Compute instance details:", JSON.stringify(computeInstance, null, 2));
      
      if (!computeInstance.callbackUrl) {
        throw new Error("No callback URL in compute instance response");
      }
      
      // Now make the actual TTS request to the compute instance
      const response = await axios.post(computeInstance.callbackUrl, payload, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': BHASHINI_INFERENCE_API_KEY
        },
        timeout: 60000,
        responseType: 'json',
        validateStatus: false // Don't throw error on non-2xx responses
      });
      
      // Check if response has the correct content type (JSON)
      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes('application/json')) {
        console.error(`Invalid content type: ${contentType}, Status: ${response.status}`);
        const errorMessage = typeof response.data === 'string' ? response.data.substring(0, 500) : 'Unknown error';
        console.error(`Error response: ${errorMessage}`);
        throw new Error(`Received non-JSON response: ${contentType}`);
      }
      
      // Check for HTTP errors
      if (response.status >= 400) {
        console.error(`HTTP error ${response.status} from Bhashini API`);
        throw new Error(`HTTP error ${response.status}`);
      }
      
      console.log("Bhashini TTS response:", JSON.stringify(response.data, null, 2));
      
      if (response.data && 
          response.data.pipelineResponse && 
          response.data.pipelineResponse[0] && 
          response.data.pipelineResponse[0].audio && 
          response.data.pipelineResponse[0].audio[0] && 
          response.data.pipelineResponse[0].audio[0].audioContent) {
              
        // Get audio content as base64 string
        const audioBase64 = response.data.pipelineResponse[0].audio[0].audioContent;
        // Convert base64 to binary
        return Buffer.from(audioBase64, 'base64');
      } else {
        console.error("Unexpected response structure from Bhashini TTS");
        throw new Error("Failed to get audio content from TTS response");
      }
    } catch (error) {
      console.error(`Error in Bhashini text-to-speech (attempt ${retries + 1}):`, error);
      
      // Increment retry counter
      retries++;
      
      // If we've hit the max retries, re-throw the error
      if (retries >= MAX_API_RETRIES) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
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
      const lang = req.body.language || 'en';
      
      if (lang === 'hi') {
        simulatedText = "मुझे FIR दर्ज करने के बारे में जानकारी चाहिए";
      } else if (lang === 'ta') {
        simulatedText = "FIR பதிவு செய்வது எப்படி?";
      } else if (lang === 'te') {
        simulatedText = "FIR ఎలా దాఖలు చేయాలి?";
      } else if (lang === 'bn') {
        simulatedText = "আমি কিভাবে একটি FIR ফাইল করব?";
      }
      
      // Simulate processing delay
      setTimeout(() => {
        res.json({ text: simulatedText });
      }, 1000);
      return;
    }
    
    // First try Bhashini API since we have the keys
    try {
      console.log("Using Bhashini API for speech recognition");
      const audio = req.body.audio; // Base64 encoded audio
      const language = req.body.language || 'en';
      
      const transcription = await bhashiniSpeechToText(audio, language);
      if (transcription) {
        return res.json({ text: transcription });
      } else {
        throw new Error("Empty transcription from Bhashini API");
      }
    } catch (bhashiniError) {
      console.error('Bhashini API error, trying fallback:', bhashiniError);
      
      // If Bhashini fails, try Google if available
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.log("Falling back to Google Speech API");
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
        
        return res.json({ text: transcription });
      } else {
        // No API credentials available or all APIs failed - simulate
        console.log("API calls failed, using simulation");
        let simulatedText = "How do I file an FIR?";
        const lang = req.body.language || 'en';
        
        if (lang === 'hi') {
          simulatedText = "मुझे FIR दर्ज करने के बारे में जानकारी चाहिए";
        } else if (lang === 'ta') {
          simulatedText = "FIR பதிவு செய்வது எப்படி?";
        } else if (lang === 'te') {
          simulatedText = "FIR ఎలా దాఖలు చేయాలి?";
        } else if (lang === 'bn') {
          simulatedText = "আমি কিভাবে একটি FIR ফাইল করব?";
        }
        
        return res.json({ text: simulatedText });
      }
    }
  } catch (error) {
    console.error('Error in speech-to-text endpoint:', error);
    res.status(500).json({ error: 'Speech recognition failed' });
  }
});

// Text-to-Speech endpoint
app.post('/text-to-speech', async (req, res) => {
  try {
    const { text, language } = req.body;
    const languageCode = language || 'en';
    
    // First try Bhashini API since we have the keys
    try {
      console.log("Using Bhashini API for text-to-speech");
      
      // Get audio content from Bhashini API
      const audioContent = await bhashiniTextToSpeech(text, languageCode);
      
      // Generate unique filename
      const filename = `bhashini-speech-${Date.now()}.mp3`;
      const audioPath = path.join(audioDir, filename);
      
      // Write audio to file
      fs.writeFileSync(audioPath, audioContent);
      
      // Send the URL to the audio file
      return res.json({ audioUrl: `/audio/${filename}` });
    } catch (bhashiniError) {
      console.error('Bhashini API error, trying fallback:', bhashiniError);
      
      // If Bhashini fails, try Google if available
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.log("Falling back to Google Text-to-Speech API");
        // Using Google Text-to-Speech
        const ttsClient = new TextToSpeechClient();
        
        const request = {
          input: { text },
          voice: { languageCode: `${languageCode}-IN`, ssmlGender: 'NEUTRAL' },
          audioConfig: { audioEncoding: 'MP3' },
        };
        
        const [response] = await ttsClient.synthesizeSpeech(request);
        const audioContent = response.audioContent;
        
        // Generate unique filename
        const filename = `speech-${Date.now()}.mp3`;
        const audioPath = path.join(audioDir, filename);
        
        // Write audio to file
        fs.writeFileSync(audioPath, audioContent);
        
        // Send the URL to the audio file
        return res.json({ audioUrl: `/audio/${filename}` });
      } else {
        // For development without working credentials, use a static sample audio file
        console.log("API calls failed, using simulation");
        
        // Create a sample audio file if it doesn't exist
        const sampleAudioPath = path.join(audioDir, 'sample-audio.mp3');
        if (!fs.existsSync(sampleAudioPath)) {
          // Create an empty file as placeholder (you'd want a real MP3 file here)
          fs.writeFileSync(sampleAudioPath, '');
          console.log("Created placeholder audio file. Replace with real MP3 for proper testing.");
        }
        
        return res.json({ audioUrl: `/audio/sample-audio.mp3` });
      }
    }
  } catch (error) {
    console.error('Error in text-to-speech endpoint:', error);
    res.status(500).json({ error: 'Text-to-speech conversion failed' });
  }
});

// Serve audio files with support for range requests
app.get('/audio/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(audioDir, filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }
  
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  
  // Handle range requests (for browsers that support seeking)
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    
    // Validate range
    if (start >= fileSize) {
      res.status(416).send('Range Not Satisfiable');
      return;
    }
    
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/mpeg'
    });
    
    file.pipe(res);
  } else {
    // No range header, serve the entire file
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'audio/mpeg',
      'Accept-Ranges': 'bytes'
    });
    
    fs.createReadStream(filePath).pipe(res);
  }
});

// The original static file server is no longer needed
// app.use('/audio', express.static(audioDir));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});