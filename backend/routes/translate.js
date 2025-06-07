import { Router } from 'express';
import { translateText as bhashiniTranslateText } from '../services/bhashiniService.js';
import { translateText as azureTranslateText } from '../services/azureTranslatorService.js';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const BHASHINI_UDYAT_KEY = process.env.BHASHINI_UDYAT_KEY;
const BHASHINI_INFERENCE_API_KEY = process.env.BHASHINI_INFERENCE_API_KEY;

// Translation Endpoint with Azure Fallback
router.post('/translate', async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;
    
    if (!text || !targetLanguage) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const source = sourceLanguage || 'en';
    const target = targetLanguage;
    
    // Try Bhashini API first
    if (BHASHINI_UDYAT_KEY && BHASHINI_INFERENCE_API_KEY) {
      try {
        const translatedText = await bhashiniTranslateText(text, source, target);
        return res.json({ translatedText });
      } catch (bhashiniError) {
        console.error('Error using Bhashini for translation:', bhashiniError);
        console.log('Trying Azure Translator as fallback...');
      }
    }
    
    // Try Azure Translator as fallback
    try {
      const translatedText = await azureTranslateText(text, target, source);
      return res.json({ translatedText });
    } catch (azureError) {
      console.error('Error using Azure for translation:', azureError);
      return res.status(500).json({ error: 'Translation failed', details: azureError.message });
    }
  } catch (error) {
    console.error('Error in translation endpoint:', error);
    res.status(500).json({ error: 'Translation failed', details: error.message });
  }
});

export default router;
