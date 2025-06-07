import { Router } from 'express';
import { generateLegalResponse as azureGenerateLegalResponse } from '../services/azureTextAnalyticsService.js';

const router = Router();

// Legal Analysis Endpoint using Azure Text Analytics
router.post('/analyze-legal-query', async (req, res) => {
  try {
    const { text, language } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Missing required parameter: text' });
    }
    
    // Use Azure Text Analytics for legal analysis
    try {
      const analysis = await azureGenerateLegalResponse(text, language || 'en');
      return res.json({ analysis });
    } catch (azureError) {
      console.error('Error using Azure for legal analysis:', azureError);
      return res.status(500).json({ error: 'Legal analysis failed', details: azureError.message });
    }
  } catch (error) {
    console.error('Error in legal analysis endpoint:', error);
    res.status(500).json({ error: 'Legal analysis failed', details: error.message });
  }
});

export default router;
