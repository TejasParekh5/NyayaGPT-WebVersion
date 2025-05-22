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
    // Check if we're using Google Speech API or another service
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
      
      res.json({ text: transcription });
    } else {
      // Placeholder for Bhashini API integration - for now simulate successful recognition
      // In development, we'll simulate as if speech recognition worked
      console.log("Using fallback speech recognition simulation");
      
      // Generate simulated response based on language
      let simulatedText = "How do I file an FIR?"; // Default English
      const lang = req.body.language || 'en';
      
      if (lang === 'hi') {
        simulatedText = "मुझे FIR दर्ज करने के बारे में जानकारी चाहिए";
      } else if (lang === 'ta') {
        simulatedText = "FIR பதிவு செய்வது எப்படி?";
      }
      
      // Simulate processing delay
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
    const { text, language } = req.body;
    const languageCode = language || 'en-IN';
    
    // Check if we're using Google TTS API or another service
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Using Google Text-to-Speech
      const ttsClient = new TextToSpeechClient();
      
      const request = {
        input: { text },
        voice: { languageCode, ssmlGender: 'NEUTRAL' },
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
      res.json({ audioUrl: `/audio/${filename}` });
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