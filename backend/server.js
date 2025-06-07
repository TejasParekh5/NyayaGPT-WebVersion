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

// Chat Endpoint with Bhashini Integration
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const language = req.body.language || 'en';
    
    console.log(`Processing chat message in ${language}: ${userMessage}`);
    
    // First, try to detect if the message is in Hindi directly
    const isHindiMessage = /[\u0900-\u097F]/.test(userMessage); // Check for Hindi Unicode range
    const effectiveLanguage = isHindiMessage ? 'hi' : language;
    
    // Try to use Bhashini API for generating a response
    if (BHASHINI_UDYAT_KEY && BHASHINI_INFERENCE_API_KEY) {
      try {
        const response = await bhashiniGenerateResponse(userMessage, effectiveLanguage);
        return res.json({ reply: response });
      } catch (bhashiniError) {
        console.error('Error using Bhashini for response generation:', bhashiniError);
        console.log('Trying Azure services as fallback...');
        
        // Try Azure Text Analytics as fallback
        try {
          const azureResponse = await azureGenerateLegalResponse(userMessage, effectiveLanguage);
          
          // Use the key phrases to find the best match in our database
          if (azureResponse.keyPhrases && azureResponse.keyPhrases.length > 0) {
            for (const phrase of azureResponse.keyPhrases) {
              // Check if any key phrase matches with our database keywords
              for (const [keyword, info] of Object.entries(legalDatabase)) {
                if (phrase.toLowerCase().includes(keyword.toLowerCase()) || 
                    keyword.toLowerCase().includes(phrase.toLowerCase())) {
                  // Found a match
                  let reply = info;
                  
                  // If language is not English, translate the response
                  if (effectiveLanguage !== 'en') {
                    try {
                      // Try Bhashini first for translation
                      reply = await bhashiniTranslateText(reply, 'en', effectiveLanguage);
                    } catch (bhashiniTranslationError) {
                      console.error('Bhashini translation error:', bhashiniTranslationError);
                      // Fall back to Azure for translation
                      try {
                        reply = await azureTranslateText(reply, effectiveLanguage, 'en');
                      } catch (azureTranslationError) {
                        console.error('Azure translation error:', azureTranslationError);
                      }
                    }
                  }
                  
                  return res.json({ 
                    reply, 
                    analysis: {
                      sentiment: azureResponse.sentiment,
                      confidence: azureResponse.confidenceScores,
                      entityCount: azureResponse.entities.length
                    }
                  });
                }
              }
            }
          }
          
          // If no match found, continue to fallback to local database
          console.log('No key phrase match found, falling back to local database...');
        } catch (azureError) {
          console.error('Error using Azure for response generation:', azureError);
          console.log('Falling back to local database...');
        }
      }
    }
    
    // Fallback to local database
    let defaultReply = effectiveLanguage === 'hi' 
      ? "मुझे इस विषय पर अभी जानकारी नहीं है। कृपया एफआईआर दर्ज करने, गिरफ्तारी अधिकारों, कानूनी सहायता, उपभोक्ता शिकायत, या संपत्ति पंजीकरण के बारे में पूछें।"
      : "I'm sorry, I don't have information on that topic yet. Please try asking about FIR filing, arrest rights, legal aid, consumer complaints, or property registration.";
    
    let reply = defaultReply;
    let foundMatch = false;
    
    // For Hindi messages, first check for direct Hindi matches
    if (isHindiMessage) {
      Object.entries(legalDatabase).forEach(([keyword, info]) => {
        // Check if keyword contains Hindi characters and is in the message
        if (/[\u0900-\u097F]/.test(keyword) && userMessage.toLowerCase().includes(keyword.toLowerCase())) {
          reply = info;
          foundMatch = true;
        }
      });
      
      // If no direct Hindi match, try to translate and match with English keywords
      if (!foundMatch) {
        try {
          const translatedMessage = await bhashiniTranslateText(userMessage, 'hi', 'en');
          const searchMsg = translatedMessage.toLowerCase();
          
          Object.entries(legalDatabase).forEach(([keyword, info]) => {
            // Only check English keywords
            if (!/[\u0900-\u097F]/.test(keyword) && searchMsg.includes(keyword.toLowerCase())) {
              // Found a match with English keyword, get the Hindi response
              const hindiKey = getHindiEquivalent(keyword);
              if (hindiKey && legalDatabase[hindiKey]) {
                reply = legalDatabase[hindiKey];
              } else {
                // Translate the English response to Hindi
                try {
                  bhashiniTranslateText(info, 'en', 'hi').then(translatedReply => {
                    reply = translatedReply;
                  });
                } catch (translationError) {
                  console.error('Translation error:', translationError);
                  // Use English reply as fallback
                  reply = info;
                }
              }
              foundMatch = true;
            }
          });
        } catch (translationError) {
          console.error('Translation error:', translationError);
        }
      }
    } 
    // For English or other language messages
    else {
      // If message is not in English and not in Hindi, translate to English first
      let searchMessage = userMessage.toLowerCase();
      if (language !== 'en' && !isHindiMessage) {
        try {
          searchMessage = await bhashiniTranslateText(userMessage, language, 'en');
          searchMessage = searchMessage.toLowerCase();
        } catch (translationError) {
          console.error('Translation error:', translationError);
          // Continue with the original message if translation fails
        }
      }
      
      // Simple keyword matching for English database
      Object.entries(legalDatabase).forEach(([keyword, info]) => {
        // Skip Hindi keywords for non-Hindi messages
        if (!/[\u0900-\u097F]/.test(keyword) && searchMessage.includes(keyword.toLowerCase())) {
          reply = info;
          foundMatch = true;
        }
      });
      
      // If language is not English, translate the response back
      if (language !== 'en' && reply !== defaultReply) {
        try {
          reply = await bhashiniTranslateText(reply, 'en', language);
        } catch (translationError) {
          console.error('Translation error for response:', translationError);
          // Continue with English response if translation fails
        }
      }
    }
    
    res.json({ reply });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
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
  "అరెస్ట్ హక్కులు": "భారతదేశంలో అరెస్టు చేయబడితే, మీకు అరెస్టు కారణాలు తెలుసుకునే హక్కు, చట్టపరమైన ప్రాతినిధ్యం పొందే హక్కు, బంధువు/స్నేహితుడికి తెలియజేసే హక్కు, 24 గంటల్లోపు మెజిస్ట్రేట్ ముందు హాజరుపరిచే హక్కు, బెయిల్ హక్కు (బెయిలబుల్ అపరాధాలకు), చిత్రహింసల నుండి రక్షణ మరియు న్యాయమైన విచారణకు హక్కు.",
  
  // Add these entries to the legal database
};

// Merge the additional entries into the legalDatabase
Object.entries(additionalEntries).forEach(([key, value]) => {
  legalDatabase[key] = value;
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
      }
      
      // Simulate processing delay
      setTimeout(() => {
        res.json({ text: simulatedText });
      }, 1000);
      return;
    }
    
    // Get the audio data and language
    const audio = req.body.audio; // Base64 encoded audio
    const language = req.body.language || 'en';
    
    // Try Bhashini API first
    try {
      const transcription = await bhashiniSpeechToText(audio, language);
      return res.json({ text: transcription });
    } catch (bhashiniError) {
      console.error('Error using Bhashini for speech-to-text:', bhashiniError);
      console.log('Trying Azure Speech Services as fallback...');
      
      // Try Azure Speech Services as fallback
      try {
        const azureTranscription = await azureSpeechToText(audio, language);
        return res.json({ text: azureTranscription });
      } catch (azureError) {
        console.error('Error using Azure for speech-to-text:', azureError);
        console.log('Trying Google Speech API as final fallback...');
      }
    }
    
    // Final fallback: Google Speech API
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Using Google Speech API
      const speechClient = new SpeechClient();
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
      
      try {
        // Use the bhashiniSpeechToText from the imported service
        const transcription = await bhashiniSpeechToText(audio, language);
        console.log('Bhashini transcription result:', transcription);
        res.json({ text: transcription });
      } catch (bhashiniError) {
        console.error('Bhashini API error:', bhashiniError);
        // Fallback to simulation if Bhashini API fails
        const simulatedText = language === 'hi' 
          ? "मुझे FIR दर्ज करने के बारे में जानकारी चाहिए" 
          : "How do I file an FIR?";
        res.json({ text: simulatedText });
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
    const { text, language, gender } = req.body;
    const languageCode = language || 'en';
    const voiceGender = gender || 'female';
    
    // Try Bhashini API first
    if (BHASHINI_UDYAT_KEY && BHASHINI_INFERENCE_API_KEY) {
      // Using Bhashini API
      console.log("Using Bhashini API for text-to-speech");
      
      try {
        // Get audio content from Bhashini API using the imported service
        const audioContent = await bhashiniTextToSpeech(text, languageCode);
        
        // Generate unique filename
        const filename = `speech-${Date.now()}.mp3`;
        const audioPath = path.join(audioDir, filename);
        
        // Write audio to file
        fs.writeFileSync(audioPath, audioContent);
        
        // Send the URL to the audio file
        return res.json({ audioUrl: `/audio/${filename}` });
      } catch (bhashiniError) {
        console.error('Error using Bhashini for text-to-speech:', bhashiniError);
        console.log('Trying Azure Speech Services as fallback...');
        
        // Try Azure Speech Services as fallback
        try {
          const azureAudioContent = await azureTextToSpeech(text, languageCode, voiceGender);
          
          // Generate unique filename
          const filename = `speech-azure-${Date.now()}.mp3`;
          const audioPath = path.join(audioDir, filename);
          
          // Write audio to file
          fs.writeFileSync(audioPath, azureAudioContent);
          
          // Send the URL to the audio file
          return res.json({ audioUrl: `/audio/${filename}` });
        } catch (azureError) {
          console.error('Error using Azure for text-to-speech:', azureError);
          console.log('Trying Google Text-to-Speech API as final fallback...');
        }
      }
    }
    
    // Final fallback: Google Text-to-Speech
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
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
      res.json({ audioUrl: `/audio/${filename}` });
    } else {
        const filename = `bhashini-speech-${Date.now()}.mp3`;
        const audioPath = path.join(audioDir, filename);
        
        // Write audio to file
        fs.writeFileSync(audioPath, Buffer.from(audioContent));
        
        // Send the URL to the audio file
        console.log(`Generated audio file: ${filename}`);
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

// Add the additional routes from separate files
import translateRoute from './routes/translate.js';
import detectLanguageRoute from './routes/detectLanguage.js';
import analyzeLegalQueryRoute from './routes/analyzeLegalQuery.js';

// Use the routes
app.use(translateRoute);
app.use(detectLanguageRoute);
app.use(analyzeLegalQueryRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});