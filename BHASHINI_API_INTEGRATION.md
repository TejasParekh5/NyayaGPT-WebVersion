# Bhashini API Integration Documentation

This document explains how the Bhashini API has been integrated with the NyaySetu chatbot application.

## What is Bhashini?

Bhashini is an AI-powered language translation platform developed by the government of India. It provides APIs for:

- Speech-to-Text (ASR)
- Text-to-Speech (TTS)
- Translation between Indian languages
- NLP capabilities for various domains

## API Credentials

The application uses the following API credentials:

- **Udyat Key**: `044ead971c-2c3c-4043-89e9-45e154285b18`
- **Inference API Key**: `ur_lB-PKydyLBVz21RlFTLpSqRyuUslBSRf-G8byTEgXPS-dnB1B6VMhA61Ljal7`

These are stored in the `.env` file and can be updated as needed.

## Integration Points

The Bhashini API has been integrated in the following ways:

1. **Chat Response Generation**: The chatbot uses Bhashini's NLP capabilities to generate responses to user queries in their preferred language.

2. **Speech-to-Text**: Users can speak in their preferred language, and the application uses Bhashini's ASR to convert speech to text.

3. **Text-to-Speech**: The application can read out responses to users in their preferred language using Bhashini's TTS.

4. **Translation**: When a user inputs text in a regional language, the application can translate it to English for processing and then translate the response back to the user's language.

## Technical Implementation

### Backend Services

The integration is implemented in:

- `bhashiniService.js`: Contains functions for interacting with the Bhashini API
- `server.js`: Uses the service functions to handle requests from the frontend

### API Endpoints

The application exposes the following endpoints:

- `/chat`: Processes user messages and returns responses
- `/speech-to-text`: Converts audio to text
- `/text-to-speech`: Converts text to audio

### Fallback Mechanisms

If the Bhashini API is unavailable, the application falls back to:

- Local database for chat responses
- Simulated speech recognition
- Sample audio files for TTS

## Supported Languages

The application currently supports the following languages via Bhashini:

- English (en)
- Hindi (hi)
- Bengali (bn)
- Tamil (ta)
- Telugu (te)
- Kannada (kn)
- Malayalam (ml)
- Marathi (mr)
- Gujarati (gu)
- Punjabi (pa)

## Future Improvements

- Implement caching to reduce API calls
- Add error handling for specific Bhashini API errors
- Expand the local database with more legal content
- Add support for more Indian languages as they become available on Bhashini
