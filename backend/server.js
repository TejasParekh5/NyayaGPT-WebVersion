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
const PORT = process.env.PORT || 8181;

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

// Import Bhashini API service functions
import { 
  getBhashiniConfig, 
  speechToText as bhashiniSpeechToText, 
  textToSpeech as bhashiniTextToSpeech,
  translateText as bhashiniTranslateText,
  generateResponse as bhashiniGenerateResponse,
  detectLanguage as bhashiniDetectLanguage
} from './services/bhashiniService.js';

// Import Azure service functions
import { 
  translateText as azureTranslateText,
  detectLanguage as azureDetectLanguage
} from './services/azureTranslatorService.js';

import {
  generateLegalResponse as azureGenerateLegalResponse
} from './services/azureTextAnalyticsService.js';

import {
  speechToText as azureSpeechToText,
  textToSpeech as azureTextToSpeech
} from './services/azureSpeechService.js';

import { azureOpenAIChat } from './services/azureOpenAIService.js';

// Bhashini API configuration from environment variables or defaults from the screenshot
const BHASHINI_UDYAT_KEY = process.env.BHASHINI_UDYAT_KEY || '044ead971c-2c3c-4043-89e9-45e154285b18';
const BHASHINI_INFERENCE_API_KEY = process.env.BHASHINI_INFERENCE_API_KEY || 'ur_lB-PKydyLBVz21RlFTLpSqRyuUslBSRf-G8byTEgXPS-dnB1B6VMhA61Ljal7';
const BHASHINI_API_URL = process.env.BHASHINI_API_URL || 'https://bhashini.gov.in/api';

// Simple in-memory database for legal information (replace with a real database in production)
const legalDatabase = {
  // English language entries
  "FIR": "To file an FIR (First Information Report) in India, visit your local police station. Provide details about the incident, including time, place, and persons involved. The police are obligated to register your FIR for cognizable offenses. You can also file an e-FIR on your state police website for certain types of cases. Bring your ID proof and any evidence related to the crime.",
  "arrest rights": "If arrested in India, you have the right to know the grounds of arrest, the right to legal representation, the right to inform a relative/friend, the right to be produced before a magistrate within 24 hours, the right to bail (for bailable offenses), protection from torture, and the right to a fair trial. You also have the right to remain silent and not be a witness against yourself.",
  "legal aid": "To apply for free legal aid in India, contact your nearest District Legal Services Authority (DLSA) or State Legal Services Authority (SLSA). Eligibility includes women, children, persons with disabilities, victims of trafficking, SC/ST individuals, industrial workmen, and persons with annual income below the specified limit. You need to fill out an application form and provide proof of income and identity. The process is free and assistance is available at legal aid clinics.",
  "consumer complaint": "To file a consumer complaint in India: 1) Write a formal complaint letter to the business first. 2) If unsatisfied, file a complaint with the appropriate Consumer Disputes Redressal Commission based on the claim amount (District Commission for claims up to ₹1 crore, State Commission for claims between ₹1-10 crores, National Commission for claims above ₹10 crores). 3) Submit required documents including proof of transaction, warranty cards, and photos of defective goods if applicable. 4) Pay the nominal filing fees. 5) Attend hearings as scheduled.",
  "property registration": "Documents needed for property registration in India include: 1) Sale deed/transfer deed, 2) Property title documents, 3) NOC from housing society (if applicable), 4) Construction approval plans, 5) Land use conversion certificate (if applicable), 6) Property tax receipts, 7) Identity proofs of all parties involved (Aadhaar card, PAN card, passport, voter ID), 8) Passport-size photographs, 9) Non-encumbrance certificate, and 10) Previous ownership documents if available.",
  
  // Hindi language entries
  "एफआईआर": "भारत में एफआईआर (प्रथम सूचना रिपोर्ट) दर्ज करने के लिए, अपने स्थानीय पुलिस स्टेशन जाएँ। घटना के बारे में विवरण प्रदान करें, जिसमें समय, स्थान और शामिल व्यक्ति शामिल हैं। संज्ञेय अपराधों के लिए पुलिस आपकी एफआईआर दर्ज करने के लिए बाध्य है। कुछ प्रकार के मामलों के लिए आप अपने राज्य की पुलिस वेबसाइट पर ई-एफआईआर भी दर्ज कर सकते हैं। अपना ID प्रमाण और अपराध से संबंधित कोई भी सबूत साथ लाएं।",
  "गिरफ्तारी अधिकार": "भारत में गिरफ्तार होने पर, आपको गिरफ्तारी के आधार जानने का अधिकार, कानूनी प्रतिनिधित्व का अधिकार, किसी रिश्तेदार/दोस्त को सूचित करने का अधिकार, 24 घंटे के भीतर मजिस्ट्रेट के सामने पेश होने का अधिकार, जमानत का अधिकार (जमानती अपराधों के लिए), यातना से सुरक्षा, और निष्पक्ष सुनवाई का अधिकार है। आपको चुप रहने और अपने खिलाफ गवाह न बनने का भी अधिकार है।",
  "कानूनी सहायता": "भारत में मुफ्त कानूनी सहायता के लिए आवेदन करने के लिए, अपने निकटतम जिला कानूनी सेवा प्राधिकरण (DLSA) या राज्य कानूनी सेवा प्राधिकरण (SLSA) से संपर्क करें। पात्रता में महिलाएं, बच्चे, विकलांग व्यक्ति, तस्करी के पीड़ित, अनुसूचित जाति/अनुसूचित जनजाति के व्यक्ति, औद्योगिक कामगार और निर्दिष्ट सीमा से कम वार्षिक आय वाले व्यक्ति शामिल हैं। आपको एक आवेदन पत्र भरना होगा और आय और पहचान का प्रमाण देना होगा। यह प्रक्रिया मुफ्त है और कानूनी सहायता क्लीनिकों में सहायता उपलब्ध है।",
  "उपभोक्ता शिकायत": "भारत में उपभोक्ता शिकायत दर्ज करने के लिए: 1) पहले व्यवसाय को एक औपचारिक शिकायत पत्र लिखें। 2) अगर संतुष्ट नहीं हैं, तो दावा राशि के अनुसार उपयुक्त उपभोक्ता विवाद निवारण आयोग के साथ शिकायत दर्ज करें (जिला आयोग के लिए ₹1 करोड़ तक के दावे, राज्य आयोग के लिए ₹1-10 करोड़ के बीच के दावे, राष्ट्रीय आयोग के लिए ₹10 करोड़ से अधिक के दावे)। 3) आवश्यक दस्तावेज जमा करें, जिनमें लेन-देन का प्रमाण, वारंटी कार्ड और यदि लागू हो तो दोषपूर्ण सामान की तस्वीरें शामिल हैं। 4) नाममात्र फाइलिंग शुल्क का भुगतान करें। 5) निर्धारित सुनवाई में भाग लें।",
  "संपत्ति पंजीकरण": "भारत में संपत्ति पंजीकरण के लिए आवश्यक दस्तावेज़ हैं: 1) बिक्री विलेख/हस्तांतरण विलेख, 2) संपत्ति स्वामित्व दस्तावेज़, 3) हाउसिंग सोसाइटी से अनापत्ति प्रमाण पत्र (यदि लागू हो), 4) निर्माण अनुमोदन योजनाएँ, 5) भूमि उपयोग रूपांतरण प्रमाणपत्र (यदि लागू हो), 6) संपत्ति कर रसीदें, 7) सभी संबंधित पक्षों के पहचान प्रमाण (आधार कार्ड, पैन कार्ड, पासपोर्ट, मतदाता पहचान पत्र), 8) पासपोर्ट आकार की तस्वीरें, 9) गैर-ऋणभार प्रमाणपत्र, और 10) यदि उपलब्ध हो तो पिछले स्वामित्व दस्तावेज।",
  
  // Alternative keywords and phrases in both languages
  "file FIR": "To file an FIR (First Information Report) in India, visit your local police station. Provide details about the incident, including time, place, and persons involved. The police are obligated to register your FIR for cognizable offenses. You can also file an e-FIR on your state police website for certain types of cases. Bring your ID proof and any evidence related to the crime.",
  "file a FIR": "To file an FIR (First Information Report) in India, visit your local police station. Provide details about the incident, including time, place, and persons involved. The police are obligated to register your FIR for cognizable offenses. You can also file an e-FIR on your state police website for certain types of cases. Bring your ID proof and any evidence related to the crime.",
  "legal rights when arrested": "If arrested in India, you have the right to know the grounds of arrest, the right to legal representation, the right to inform a relative/friend, the right to be produced before a magistrate within 24 hours, the right to bail (for bailable offenses), protection from torture, and the right to a fair trial. You also have the right to remain silent and not be a witness against yourself.",
  "arrested rights": "If arrested in India, you have the right to know the grounds of arrest, the right to legal representation, the right to inform a relative/friend, the right to be produced before a magistrate within 24 hours, the right to bail (for bailable offenses), protection from torture, and the right to a fair trial. You also have the right to remain silent and not be a witness against yourself.",
  "apply for legal aid": "To apply for free legal aid in India, contact your nearest District Legal Services Authority (DLSA) or State Legal Services Authority (SLSA). Eligibility includes women, children, persons with disabilities, victims of trafficking, SC/ST individuals, industrial workmen, and persons with annual income below the specified limit. You need to fill out an application form and provide proof of income and identity. The process is free and assistance is available at legal aid clinics.",
  "consumer complaints": "To file a consumer complaint in India: 1) Write a formal complaint letter to the business first. 2) If unsatisfied, file a complaint with the appropriate Consumer Disputes Redressal Commission based on the claim amount (District Commission for claims up to ₹1 crore, State Commission for claims between ₹1-10 crores, National Commission for claims above ₹10 crores). 3) Submit required documents including proof of transaction, warranty cards, and photos of defective goods if applicable. 4) Pay the nominal filing fees. 5) Attend hearings as scheduled.",
  "property documents": "Documents needed for property registration in India include: 1) Sale deed/transfer deed, 2) Property title documents, 3) NOC from housing society (if applicable), 4) Construction approval plans, 5) Land use conversion certificate (if applicable), 6) Property tax receipts, 7) Identity proofs of all parties involved (Aadhaar card, PAN card, passport, voter ID), 8) Passport-size photographs, 9) Non-encumbrance certificate, and 10) Previous ownership documents if available.",
  "FIR दर्ज": "भारत में एफआईआर (प्रथम सूचना रिपोर्ट) दर्ज करने के लिए, अपने स्थानीय पुलिस स्टेशन जाएँ। घटना के बारे में विवरण प्रदान करें, जिसमें समय, स्थान और शामिल व्यक्ति शामिल हैं। संज्ञेय अपराधों के लिए पुलिस आपकी एफआईआर दर्ज करने के लिए बाध्य है। कुछ प्रकार के मामलों के लिए आप अपने राज्य की पुलिस वेबसाइट पर ई-एफआईआर भी दर्ज कर सकते हैं। अपना ID प्रमाण और अपराध से संबंधित कोई भी सबूत साथ लाएं।",
  "संपत्ति दस्तावेज": "भारत में संपत्ति पंजीकरण के लिए आवश्यक दस्तावेज़ हैं: 1) बिक्री विलेख/हस्तांतरण विलेख, 2) संपत्ति स्वामित्व दस्तावेज़, 3) हाउसिंग सोसाइटी से अनापत्ति प्रमाण पत्र (यदि लागू हो), 4) निर्माण अनुमोदन योजनाएँ, 5) भूमि उपयोग रूपांतरण प्रमाणपत्र (यदि लागू हो), 6) संपत्ति कर रसीदें, 7) सभी संबंधित पक्षों के पहचान प्रमाण (आधार कार्ड, पैन कार्ड, पासपोर्ट, मतदाता पहचान पत्र), 8) पासपोर्ट आकार की तस्वीरें, 9) गैर-ऋणभार प्रमाणपत्र, और 10) यदि उपलब्ध हो तो पिछले स्वामित्व दस्तावेज।"
};

// Chat Endpoint with Azure OpenAI for all answers
app.post('/chat', async (req, res) => {
  console.log('DEBUG: /chat endpoint hit with message:', req.body.message, 'language:', req.body.language);
  try {
    const userMessage = req.body.message;
    const language = req.body.language || 'en';
    const messages = [
      { role: 'system', content: `You are a helpful legal assistant for Indian law. Always answer in the user's language (${language}).` },
      { role: 'user', content: userMessage }
    ];
    // Always use the correct deployment name for Azure OpenAI
    const openaiReply = await azureOpenAIChat(messages, 'gpt-4.1');
    console.log('DEBUG: Azure OpenAI reply:', openaiReply);
    if (!openaiReply || openaiReply.trim() === "") {
      res.json({ reply: "Sorry, I could not generate a response. Please try rephrasing your question." });
    } else {
      res.json({ reply: openaiReply });
    }
  } catch (error) {
    console.error('Azure OpenAI error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to map English keywords to their Hindi equivalents
function getHindiEquivalent(englishKey) {
  const mapping = {
    "FIR": "एफआईआर",
    "arrest rights": "गिरफ्तारी अधिकार",
    "legal aid": "कानूनी सहायता",
    "consumer complaint": "उपभोक्ता शिकायत",
    "property registration": "संपत्ति पंजीकरण",
    "file FIR": "एफआईआर दर्ज",
    "property documents": "संपत्ति दस्तावेज"
  };
  
  return mapping[englishKey] || null;
}

// Add Bengali, Tamil, Telugu, and other language entries to the legal database
const additionalEntries = {
  // Bengali entries
  "এফআইআর": "ভারতে একটি এফআইআর (প্রথম তথ্য রিপোর্ট) দায়ের করতে, আপনার স্থানীয় পুলিশ স্টেশনে যান। ঘটনার বিবরণ দিন, যার মধ্যে সময়, স্থান এবং জড়িত ব্যক্তিরা অন্তর্ভুক্ত। পুলিশ আপনার এফআইআর নথিভুক্ত করতে বাধ্য। আপনি কিছু ধরনের ক্ষেত্রে আপনার রাজ্য পুলিশ ওয়েবসাইটে ই-এফআইআরও দায়ের করতে পারেন।",
  "গ্রেপ্তার অধিকার": "ভারতে গ্রেপ্তার হলে, আপনার গ্রেপ্তারের কারণ জানার অধিকার, আইনি প্রতিনিধিত্বের অধিকার, কোনো আত্মীয়/বন্ধুকে অবহিত করার অধিকার, ২৪ ঘন্টার মধ্যে ম্যাজিস্ট্রেটের সামনে হাজির হওয়ার অধিকার, জামিনের অধিকার (জামিনযোগ্য অপরাধের জন্য), নির্যাতন থেকে সুরক্ষা এবং সুষ্ঠু বিচারের অধিকার রয়েছে।",
  
  // Tamil entries
  "FIR பதிவு": "இந்தியாவில் FIR (முதல் தகவல் அறிக்கை) பதிவு செய்ய, உங்கள் உள்ளூர் காவல் நிலையத்திற்குச் செல்லவும். சம்பவம் பற்றிய விவரங்களை வழங்கவும், அதில் நேரம், இடம் மற்றும் சம்பந்தப்பட்ட நபர்கள் உள்ளிட்டவை. குற்றவியல் குற்றங்களுக்கு காவல்துறை உங்கள் FIR ஐ பதிவு செய்ய கடமைப்பட்டுள்ளது.",
  "கைது உரிமைகள்": "இந்தியாவில் கைது செய்யப்பட்டால், கைது செய்வதற்கான காரணங்களை அறியும் உரிமை, சட்ட பிரதிநிதித்துவ உரிமை, உறவினர்/நண்பருக்கு தெரிவிக்கும் உரிமை, 24 மணி நேரத்திற்குள் நீதவான் முன் ஆஜர்படுத்தப்படும் உரிமை, பிணை உரிமை, சித்ரவதையிலிருந்து பாதுகாப்பு மற்றும் நியாயமான விசாரணைக்கான உரிமை ஆகியவை உங்களுக்கு உண்டு.",
  
  // Telugu entries
  "FIR దాఖలు": "భారతదేశంలో FIR (ఫస్ట్ ఇన్ఫర్మేషన్ రిపోర్ట్) దాఖలు చేయడానికి, మీ స్థానిక పోలీస్ స్టేషన్‌కి వెళ్లండి. సంఘటన గురించి వివరాలు అందించండి, సమయం, ప్రదేశం మరియు పాల్గొన్న వ్యక్తులు. కాగ్నిజబుల్ నేరాలకు పోలీసులు మీ FIRని నమోదు చేయాల్సిన బాధ్యత ఉంది.",
  "అరెస్ట్ హక్కులు": "భారతదేశంలో అరెస్టు చేయబడితే, మీకు అరెస్టు కారణాలు తెలుసుకునే హక్కు, చట్టపరమైన ప్రాతినిధ్యం పొందే హక్కు, బంధువు/స్నేహితుడికి తెలియజేసే హక్కు, 24 గంటల్లోపు మెజిస్ట్రేట్ ముందు హాజరుపరిచే హక్కు, బెయిల్ హక్కు (బెయిల్‌బుల్ అపరాధాలకు), చిత్రహింసల నుండి రక్షణ మరియు న్యాయమైన విచారణకు హక్కు.",
  
  // Add these entries to the legal database
};

// Merge the additional entries into the legalDatabase
Object.entries(additionalEntries).forEach(([key, value]) => {
  legalDatabase[key] = value;
});

// Speech-to-Text endpoint
app.post('/speech-to-text', async (req, res) => {
  try {
    const audio = req.body.audio; // Base64 encoded audio
    const language = req.body.language || 'en';

    if (req.body.simulatedRequest) {
      console.log('Handling simulated speech recognition request');
      const simulatedText = language === 'hi'
        ? 'मुझे FIR दर्ज करने के बारे में जानकारी चाहिए'
        : 'How do I file an FIR?';
      return res.json({ text: simulatedText });
    }

    if (BHASHINI_UDYAT_KEY && BHASHINI_INFERENCE_API_KEY) {
      try {
        const transcription = await bhashiniSpeechToText(audio, language);
        console.log('Bhashini transcription result:', transcription);
        return res.json({ text: transcription });
      } catch (bhashiniError) {
        console.error('Bhashini API error:', bhashiniError);
        console.log('Trying Azure Speech Services as fallback...');

        try {
          const azureTranscription = await azureSpeechToText(audio, language);
          return res.json({ text: azureTranscription });
        } catch (azureError) {
          console.error('Error using Azure for speech-to-text:', azureError);
          console.log('Trying Google Speech API as final fallback...');

          if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            try {
              const speechClient = new SpeechClient();
              const audioBuffer = Buffer.from(audio, 'base64');

              const request = {
                audio: {
                  content: audioBuffer.toString('base64'),
                },
                config: {
                  encoding: 'LINEAR16',
                  sampleRateHertz: 16000,
                  languageCode: language,
                },
              };

              const [response] = await speechClient.recognize(request);
              const transcription = response.results
                .map(result => result.alternatives[0].transcript)
                .join('\n');

              return res.json({ text: transcription });
            } catch (googleError) {
              console.error('Google Speech API error:', googleError);
              res.status(500).json({ error: 'Speech recognition failed' });
            }
          } else {
            res.status(500).json({ error: 'No valid speech recognition service available' });
          }
        }
      }
    } else {
      res.status(500).json({ error: 'No valid speech recognition service available' });
    }
  } catch (error) {
    console.error('Error in speech-to-text endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Text-to-Speech endpoint
app.post('/text-to-speech', async (req, res) => {
  try {
    const text = req.body.text;
    const languageCode = req.body.languageCode || 'en';
    const voiceGender = req.body.voiceGender || 'NEUTRAL';

    if (BHASHINI_UDYAT_KEY && BHASHINI_INFERENCE_API_KEY) {
      try {
        const audioContent = await bhashiniTextToSpeech(text, languageCode);

        const filename = `speech-${Date.now()}.mp3`;
        const audioPath = path.join(audioDir, filename);
        fs.writeFileSync(audioPath, audioContent);

        return res.json({ audioUrl: `/audio/${filename}` });
      } catch (bhashiniError) {
        console.error('Error using Bhashini for text-to-speech:', bhashiniError);
        console.log('Trying Azure Speech Services as fallback...');

        try {
          const azureAudioContent = await azureTextToSpeech(text, languageCode, voiceGender);

          const filename = `speech-azure-${Date.now()}.mp3`;
          const audioPath = path.join(audioDir, filename);
          fs.writeFileSync(audioPath, azureAudioContent);

          return res.json({ audioUrl: `/audio/${filename}` });
        } catch (azureError) {
          console.error('Error using Azure for text-to-speech:', azureError);
          console.log('Trying Google Text-to-Speech API as final fallback...');

          if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            try {
              const ttsClient = new TextToSpeechClient();
              const request = {
                input: { text },
                voice: { languageCode: `${languageCode}-IN`, ssmlGender: voiceGender },
                audioConfig: { audioEncoding: 'MP3' },
              };

              const [response] = await ttsClient.synthesizeSpeech(request);
              const audioContent = response.audioContent;

              const filename = `speech-${Date.now()}.mp3`;
              const audioPath = path.join(audioDir, filename);
              fs.writeFileSync(audioPath, audioContent);

              return res.json({ audioUrl: `/audio/${filename}` });
            } catch (googleError) {
              console.error('Google Text-to-Speech API error:', googleError);
              res.status(500).json({ error: 'Text-to-speech failed' });
            }
          } else {
            res.status(500).json({ error: 'No valid text-to-speech service available' });
          }
        }
      }
    } else {
      res.status(500).json({ error: 'No valid text-to-speech service available' });
    }
  } catch (error) {
    console.error('Error in text-to-speech endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve audio files
app.use('/audio', express.static(audioDir));

// Add the additional routes from separate files
import translateRoute from './routes/translate.js';
import detectLanguageRoute from './routes/detectLanguage.js';
import analyzeLegalQueryRoute from './routes/analyzeLegalQuery.js';
import azureOpenAIRoute from './routes/azureOpenAI.js';

// Use the routes
app.use(translateRoute);
app.use(detectLanguageRoute);
app.use(analyzeLegalQueryRoute);
app.use(azureOpenAIRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});