// Azure Services Test Script
// This script tests the Azure service integrations for NyaySetu

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import Azure services
import { translateText, detectLanguage } from './services/azureTranslatorService.js';
import { analyzeSentiment, extractKeyPhrases, recognizeEntities, generateLegalResponse } from './services/azureTextAnalyticsService.js';
import { speechToText, textToSpeech } from './services/azureSpeechService.js';

// Initialize paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const audioDir = path.join(__dirname, 'audio');

// Load environment variables
dotenv.config();

// Create audio directory if it doesn't exist
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir);
}

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Test Azure Translator Service
async function testTranslatorService() {
  console.log(`${colors.blue}Testing Azure Translator Service...${colors.reset}`);
  
  try {
    // Test 1: English to Hindi translation
    const englishText = "How do I file an FIR?";
    console.log(`Translating: "${englishText}" to Hindi`);
    const hindiTranslation = await translateText(englishText, 'hi', 'en');
    console.log(`${colors.green}Result: "${hindiTranslation}"${colors.reset}`);
    
    // Test 2: Hindi to English translation
    const hindiText = "मुझे FIR दर्ज करने के बारे में जानकारी चाहिए";
    console.log(`Translating: "${hindiText}" to English`);
    const englishTranslation = await translateText(hindiText, 'en', 'hi');
    console.log(`${colors.green}Result: "${englishTranslation}"${colors.reset}`);
    
    // Test 3: Language detection
    console.log(`Detecting language for: "${hindiText}"`);
    const detectedLanguage = await detectLanguage(hindiText);
    console.log(`${colors.green}Detected language: ${detectedLanguage}${colors.reset}`);
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Translator Service Test Failed: ${error.message}${colors.reset}`);
    return false;
  }
}

// Test Azure Text Analytics Service
async function testTextAnalyticsService() {
  console.log(`\n${colors.blue}Testing Azure Text Analytics Service...${colors.reset}`);
  
  try {
    const legalQuery = "I was arrested yesterday and the police didn't tell me why. What are my rights?";
    
    // Test 1: Sentiment analysis
    console.log(`Analyzing sentiment for: "${legalQuery}"`);
    const sentiment = await analyzeSentiment(legalQuery);
    console.log(`${colors.green}Sentiment: ${sentiment.sentiment}, Confidence: ${JSON.stringify(sentiment.confidenceScores)}${colors.reset}`);
    
    // Test 2: Key phrase extraction
    console.log(`Extracting key phrases from: "${legalQuery}"`);
    const keyPhrases = await extractKeyPhrases(legalQuery);
    console.log(`${colors.green}Key phrases: ${keyPhrases.join(', ')}${colors.reset}`);
    
    // Test 3: Entity recognition
    console.log(`Recognizing entities in: "${legalQuery}"`);
    const entities = await recognizeEntities(legalQuery);
    console.log(`${colors.green}Entities: ${entities.map(e => e.text).join(', ')}${colors.reset}`);
    
    // Test 4: Generate legal response
    console.log(`Generating legal response for: "${legalQuery}"`);
    const legalResponse = await generateLegalResponse(legalQuery);
    console.log(`${colors.green}Legal response generated with ${legalResponse.keyPhrases.length} key phrases and ${legalResponse.entities.length} entities${colors.reset}`);
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Text Analytics Service Test Failed: ${error.message}${colors.reset}`);
    return false;
  }
}

// Test Azure Speech Service
async function testSpeechService() {
  console.log(`\n${colors.blue}Testing Azure Speech Service...${colors.reset}`);
  
  try {
    // Test 1: Text to Speech
    const textForSpeech = "How do I file an FIR in India?";
    console.log(`Converting to speech: "${textForSpeech}"`);
    
    const audioContent = await textToSpeech(textForSpeech, 'en', 'female');
    const filename = `azure-tts-test-${Date.now()}.mp3`;
    const audioPath = path.join(audioDir, filename);
    
    fs.writeFileSync(audioPath, audioContent);
    console.log(`${colors.green}Speech file created: ${audioPath}${colors.reset}`);
    
    // Test 2: Speech to Text (this would require an audio file)
    console.log(`${colors.yellow}Note: Speech-to-Text test requires an audio file and is skipped in this basic test.${colors.reset}`);
    
    return true;
  } catch (error) {
    console.error(`${colors.red}Speech Service Test Failed: ${error.message}${colors.reset}`);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log(`${colors.blue}=== AZURE SERVICES INTEGRATION TEST ====${colors.reset}\n`);
  
  const results = {
    translator: await testTranslatorService(),
    textAnalytics: await testTextAnalyticsService(),
    speech: await testSpeechService()
  };
  
  console.log(`\n${colors.blue}=== TEST SUMMARY ====${colors.reset}`);
  console.log(`Translator Service: ${results.translator ? colors.green + 'PASSED' : colors.red + 'FAILED'}${colors.reset}`);
  console.log(`Text Analytics Service: ${results.textAnalytics ? colors.green + 'PASSED' : colors.red + 'FAILED'}${colors.reset}`);
  console.log(`Speech Service: ${results.speech ? colors.green + 'PASSED' : colors.red + 'FAILED'}${colors.reset}`);
  
  const allPassed = Object.values(results).every(Boolean);
  console.log(`\nOverall Result: ${allPassed ? colors.green + 'ALL TESTS PASSED' : colors.red + 'SOME TESTS FAILED'}${colors.reset}`);
  
  if (!allPassed) {
    console.log(`\n${colors.yellow}Troubleshooting Tips:${colors.reset}`);
    console.log(`1. Check if your Azure API keys are correctly configured in .env`);
    console.log(`2. Verify that the Azure services are properly provisioned and active`);
    console.log(`3. Ensure you have sufficient credits remaining in your Azure account`);
    console.log(`4. Check network connectivity to Azure services`);
  }
}

// Execute the tests
runAllTests().catch(error => {
  console.error(`${colors.red}Error running tests: ${error.message}${colors.reset}`);
});
