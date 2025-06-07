import { Router } from 'express';
import { detectLanguage as bhashiniDetectLanguage } from '../services/bhashiniService.js';
import { detectLanguage as azureDetectLanguage } from '../services/azureTranslatorService.js';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const BHASHINI_UDYAT_KEY = process.env.BHASHINI_UDYAT_KEY;
const BHASHINI_INFERENCE_API_KEY = process.env.BHASHINI_INFERENCE_API_KEY;

// Detect Language Endpoint with Azure Fallback
router.post('/detect-language', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Missing required parameter: text' });
    }
    
    // Try Bhashini API first
    if (BHASHINI_UDYAT_KEY && BHASHINI_INFERENCE_API_KEY) {
      try {
        const detectedLanguage = await bhashiniDetectLanguage(text);
        return res.json({ detectedLanguage });
      } catch (bhashiniError) {
        console.error('Error using Bhashini for language detection:', bhashiniError);
        console.log('Trying Azure Translator as fallback...');
      }
    }
    
    // Try Azure Translator as fallback
    try {
      const detectedLanguage = await azureDetectLanguage(text);
      return res.json({ detectedLanguage });
    } catch (azureError) {
      console.error('Error using Azure for language detection:', azureError);
      return res.status(500).json({ error: 'Language detection failed', details: azureError.message });
    }
  } catch (error) {
    console.error('Error in language detection endpoint:', error);
    res.status(500).json({ error: 'Language detection failed', details: error.message });
  }
});

export default router;
