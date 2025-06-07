# Azure Integration Implementation Checklist

Use this checklist to implement the Azure services integration with your NyaySetu application.

## Prerequisites

- [ ] Azure account with at least 45 credits available
- [ ] Existing NyaySetu application with Bhashini API integration
- [ ] Node.js and npm installed on your development machine

## Step 1: Create Azure Resources

- [ ] Create a Resource Group in Azure Portal
- [ ] Create Azure Cognitive Services resource
- [ ] Create Azure Speech Services resource
- [ ] Note down all API keys and endpoints

## Step 2: Add Service Files

- [ ] Create the Azure Translator Service file

  - [ ] Path: `backend/services/azureTranslatorService.js`
  - [ ] Implement the `detectLanguage` function
  - [ ] Implement the `translateText` function
  - [ ] Implement the `batchTranslate` function

- [ ] Create the Azure Text Analytics Service file

  - [ ] Path: `backend/services/azureTextAnalyticsService.js`
  - [ ] Implement the `analyzeSentiment` function
  - [ ] Implement the `extractKeyPhrases` function
  - [ ] Implement the `recognizeEntities` function
  - [ ] Implement the `generateLegalResponse` function

- [ ] Create the Azure Speech Service file
  - [ ] Path: `backend/services/azureSpeechService.js`
  - [ ] Implement the `speechToText` function
  - [ ] Implement the `textToSpeech` function

## Step 3: Add API Endpoints

- [ ] Create the Translation Endpoint

  - [ ] Path: `backend/routes/translate.js`
  - [ ] Implement the `/translate` POST route

- [ ] Create the Language Detection Endpoint

  - [ ] Path: `backend/routes/detectLanguage.js`
  - [ ] Implement the `/detect-language` POST route

- [ ] Create the Legal Analysis Endpoint
  - [ ] Path: `backend/routes/analyzeLegalQuery.js`
  - [ ] Implement the `/analyze-legal-query` POST route

## Step 4: Update Server.js

- [ ] Import Azure service functions
- [ ] Update the chat endpoint with Azure fallback
- [ ] Update the speech-to-text endpoint with Azure fallback
- [ ] Update the text-to-speech endpoint with Azure fallback
- [ ] Include the new route files

## Step 5: Create Environment Configuration

- [ ] Create `.env.example` file with Azure configurations
- [ ] Create `.env.azure` file with your specific Azure keys
- [ ] Create or update `.env` file with your Azure keys

## Step 6: Test Implementation

- [ ] Create the test script `backend/test-azure-services.js`
- [ ] Add the `test:azure` script to package.json
- [ ] Run the test script to verify integration
- [ ] Test fallback behavior by temporarily disabling Bhashini API

## Step 7: Documentation

- [ ] Create or update README.md with Azure integration information
- [ ] Add the AZURE_INTEGRATION.md documentation
- [ ] Add the AZURE_COST_OPTIMIZATION.md guide
- [ ] Review all documentation for accuracy

## Step 8: Deployment

- [ ] Deploy the updated application to Azure App Service
- [ ] Configure environment variables in Azure App Service
- [ ] Test the deployed application
- [ ] Monitor resource usage to stay within the 45 credit limit

## Notes on Implementation

1. Always implement Azure services as fallbacks, not replacements for Bhashini API
2. Use try-catch blocks to handle failures gracefully
3. Implement proper error logging
4. Use cost optimization strategies as described in AZURE_COST_OPTIMIZATION.md
5. Consider implementing caching for frequently used translations
6. Batch API requests when possible to reduce costs

## Verification Tests

- [ ] Test Bhashini API primary path works (chat, speech-to-text, text-to-speech)
- [ ] Test Azure fallback works when Bhashini returns errors
- [ ] Test all supported languages work with both APIs
- [ ] Test error scenarios are handled gracefully
- [ ] Verify resource usage is within expected limits
