// Azure OpenAI Service for Chat/Completions
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const AZURE_OPENAI_KEY = process.env.AZURE_OPENAI_KEY;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_REGION = process.env.AZURE_OPENAI_REGION || 'eastus';

/**
 * Call Azure OpenAI Chat Completion API
 * @param {Array} messages - Array of {role, content} objects
 * @param {string} deployment - Azure OpenAI deployment name (e.g., 'gpt-35-turbo')
 * @returns {Promise<string>} - The assistant's reply
 */
// IMPORTANT: Update the deployment name below to match your Azure OpenAI deployment name from the Azure portal.
// Updated for Azure OpenAI API version 2024-12-01-preview
// Make sure your deployment name matches the one in your Azure portal
export const azureOpenAIChat = async (messages, deployment = 'gpt-4.1') => {
  if (!AZURE_OPENAI_KEY || !AZURE_OPENAI_ENDPOINT) {
    throw new Error('Azure OpenAI credentials not set');
  }
  // Use the new API version and endpoint as per latest Azure OpenAI SDK
  const url = `${AZURE_OPENAI_ENDPOINT}openai/deployments/${deployment}/chat/completions?api-version=2024-12-01-preview`;
  try {
    const response = await axios.post(
      url,
      {
        messages,
        max_tokens: 512,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': AZURE_OPENAI_KEY,
          'azure-region': AZURE_OPENAI_REGION,
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Azure OpenAI API error:', error.response?.data || error.message);
    throw error;
  }
};

export default { azureOpenAIChat };
