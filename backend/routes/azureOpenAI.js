// Express route for Azure OpenAI chat endpoint
import express from 'express';
import { azureOpenAIChat } from '../services/azureOpenAIService.js';

const router = express.Router();

// POST /azure-openai-chat
router.post('/azure-openai-chat', async (req, res) => {
  try {
    const { messages, deployment } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages must be an array' });
    }
    const reply = await azureOpenAIChat(messages, deployment);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
