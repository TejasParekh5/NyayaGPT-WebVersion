# Azure Speech Services Integration Guide

## Setting up Azure Speech Services for NyaySetu

This guide explains how to integrate Azure Speech Services to enhance your chatbot's speech-to-text and text-to-speech capabilities.

### 1. Create Azure Speech Service Resource

1. Log in to the Azure Portal
2. Click "Create a resource" > "AI + Machine Learning" > "Speech Service"
3. Configure as follows:
   - **Resource Group**: "nyaysetu-rg" (use the same as before)
   - **Region**: East US (or region closest to your users)
   - **Name**: "nyaysetu-speech"
   - **Pricing tier**: Free F0 (1 free resource per subscription)
4. Click "Review + Create" > "Create"

### 2. Get Your Speech Service API Keys

1. Go to your Speech Service resource
2. Navigate to "Keys and Endpoint"
3. Copy Key 1 and the Region

### 3. Integrate Azure Speech-to-Text Service

Create a new file at `backend/services/azureSpeechService.js`:

```javascript
// Azure Speech Service
import {
	SpeechConfig,
	AudioConfig,
	SpeechRecognizer,
	ResultReason,
} from "microsoft-cognitiveservices-speech-sdk";
import { Buffer } from "buffer";
import dotenv from "dotenv";

dotenv.config();

const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || "eastus";

/**
 * Convert speech to text using Azure Speech Service
 * @param {string} audioData - Base64 encoded audio data
 * @param {string} language - Language code
 * @returns {Promise<string>} Transcribed text
 */
export const speechToText = async (audioData, language) => {
	try {
		// Convert base64 to buffer
		const audioDataBuffer = Buffer.from(audioData, "base64");

		// Map language code to Azure format
		const langCode = mapLanguageCode(language);

		// Create speech configuration
		const speechConfig = SpeechConfig.fromSubscription(
			AZURE_SPEECH_KEY,
			AZURE_SPEECH_REGION
		);
		speechConfig.speechRecognitionLanguage = langCode;

		// Create audio configuration from push stream
		const pushStream = AudioConfig.fromStreamInput(audioDataBuffer);

		// Create speech recognizer
		const recognizer = new SpeechRecognizer(speechConfig, pushStream);

		return new Promise((resolve, reject) => {
			recognizer.recognizeOnceAsync(
				(result) => {
					if (result.reason === ResultReason.RecognizedSpeech) {
						resolve(result.text);
					} else {
						reject(new Error(`Speech recognition failed: ${result.reason}`));
					}
					recognizer.close();
				},
				(err) => {
					recognizer.close();
					reject(err);
				}
			);
		});
	} catch (error) {
		console.error("Azure Speech-to-Text error:", error);
		throw error;
	}
};

/**
 * Convert text to speech using Azure Speech Service
 * @param {string} text - Text to convert to speech
 * @param {string} language - Language code
 * @param {string} gender - Voice gender (male or female)
 * @returns {Promise<ArrayBuffer>} Audio data
 */
export const textToSpeech = async (text, language, gender = "female") => {
	try {
		// Map language code and select voice
		const [langCode, voiceName] = getVoiceForLanguage(language, gender);

		// Create speech configuration
		const speechConfig = SpeechConfig.fromSubscription(
			AZURE_SPEECH_KEY,
			AZURE_SPEECH_REGION
		);
		speechConfig.speechSynthesisLanguage = langCode;
		speechConfig.speechSynthesisVoiceName = voiceName;

		// Create synthesizer
		const synthesizer = new SpeechSynthesizer(speechConfig);

		return new Promise((resolve, reject) => {
			synthesizer.speakTextAsync(
				text,
				(result) => {
					if (result.reason === ResultReason.SynthesizingAudioCompleted) {
						resolve(result.audioData);
					} else {
						reject(new Error(`Speech synthesis failed: ${result.reason}`));
					}
					synthesizer.close();
				},
				(error) => {
					synthesizer.close();
					reject(error);
				}
			);
		});
	} catch (error) {
		console.error("Azure Text-to-Speech error:", error);
		throw error;
	}
};

/**
 * Maps language codes to Azure Speech format
 */
const mapLanguageCode = (code) => {
	const mapping = {
		hi: "hi-IN",
		en: "en-IN",
		bn: "bn-IN",
		ta: "ta-IN",
		te: "te-IN",
		kn: "kn-IN",
		ml: "ml-IN",
		mr: "mr-IN",
		gu: "gu-IN",
		pa: "pa-IN",
	};

	return mapping[code] || "en-US";
};

/**
 * Get appropriate voice name for language and gender
 */
const getVoiceForLanguage = (language, gender) => {
	const voices = {
		en: {
			female: ["en-IN", "en-IN-NeerjaNeural"],
			male: ["en-IN", "en-IN-PrabhatNeural"],
		},
		hi: {
			female: ["hi-IN", "hi-IN-SwaraNeural"],
			male: ["hi-IN", "hi-IN-MadhurNeural"],
		},
		bn: {
			female: ["bn-IN", "bn-IN-TanishaaNeural"],
			male: ["bn-IN", "bn-IN-BashkarNeural"],
		},
		ta: {
			female: ["ta-IN", "ta-IN-PallaviNeural"],
			male: ["ta-IN", "ta-IN-ValluvarNeural"],
		},
		te: {
			female: ["te-IN", "te-IN-ShrutiNeural"],
			male: ["te-IN", "te-IN-MohanNeural"],
		},
		gu: {
			female: ["gu-IN", "gu-IN-DhwaniNeural"],
			male: ["gu-IN", "gu-IN-NiranjanNeural"],
		},
		// Add more languages as needed
	};

	if (voices[language] && voices[language][gender]) {
		return voices[language][gender];
	}

	// Default to English female voice
	return ["en-IN", "en-IN-NeerjaNeural"];
};
```

### 4. Update Your Server with Azure Speech Integration

Update your `.env` file to include the Azure Speech keys:

```
# Azure Speech configuration
AZURE_SPEECH_KEY=your_speech_key_here
AZURE_SPEECH_REGION=eastus
```

Modify your `server.js` to use Azure Speech as a backup service to Bhashini:

```javascript
// Import Azure speech services
import {
	speechToText as azureSpeechToText,
	textToSpeech as azureTextToSpeech,
} from "./services/azureSpeechService.js";
```

Update your speech-to-text endpoint to use Azure as a fallback:

```javascript
// Speech-to-Text endpoint
app.post("/speech-to-text", async (req, res) => {
	try {
		// ... existing code ...

		// Real speech recognition request
		if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
			// Using Google Speech API (existing code)
			// ...
		} else if (BHASHINI_UDYAT_KEY && BHASHINI_INFERENCE_API_KEY) {
			// Using Bhashini API
			console.log("Using Bhashini API for speech recognition");
			const audio = req.body.audio;
			const language = req.body.language || "en";

			try {
				const transcription = await bhashiniSpeechToText(audio, language);
				res.json({ text: transcription });
			} catch (bhashiniError) {
				console.error(
					"Bhashini API error, trying Azure Speech:",
					bhashiniError
				);

				// Try Azure Speech services as fallback
				if (process.env.AZURE_SPEECH_KEY) {
					try {
						const azureTranscription = await azureSpeechToText(audio, language);
						console.log("Azure transcription result:", azureTranscription);
						res.json({ text: azureTranscription });
						return;
					} catch (azureError) {
						console.error("Azure Speech API error:", azureError);
						// Continue to simulation fallback
					}
				}

				// Fallback to simulation if both APIs fail
				const simulatedText =
					language === "hi"
						? "मुझे FIR दर्ज करने के बारे में जानकारी चाहिए"
						: "How do I file an FIR?";
				res.json({ text: simulatedText });
			}
		}
		// ... rest of existing code ...
	} catch (error) {
		console.error("Error in speech-to-text endpoint:", error);
		res.status(500).json({ error: "Speech recognition failed" });
	}
});
```

Similarly, update your text-to-speech endpoint to use Azure as a fallback:

```javascript
// Text-to-Speech endpoint
app.post('/text-to-speech', async (req, res) => {
  try {
    const { text, language } = req.body;
    const languageCode = language || 'en';

    // ... existing code ...

    } else if (BHASHINI_UDYAT_KEY && BHASHINI_INFERENCE_API_KEY) {
      // Using Bhashini API
      console.log("Using Bhashini API for text-to-speech");

      try {
        // Get audio content from Bhashini API
        const audioContent = await bhashiniTextToSpeech(text, languageCode);

        // ... existing code ...

      } catch (bhashiniError) {
        console.error('Bhashini API error, trying Azure Speech:', bhashiniError);

        // Try Azure Speech services as fallback
        if (process.env.AZURE_SPEECH_KEY) {
          try {
            const gender = req.body.gender || 'female';
            const audioContent = await azureTextToSpeech(text, languageCode, gender);

            // Generate unique filename
            const filename = `azure-speech-${Date.now()}.mp3`;
            const audioPath = path.join(audioDir, filename);

            // Write audio to file
            fs.writeFileSync(audioPath, Buffer.from(audioContent));

            // Send the URL to the audio file
            console.log(`Generated Azure audio file: ${filename}`);
            res.json({ audioUrl: `/audio/${filename}` });
            return;
          } catch (azureError) {
            console.error('Azure Speech API error:', azureError);
            // Continue to fallback
          }
        }

        // Fallback to sample audio if both APIs fail
        res.json({ audioUrl: `/audio/sample-audio.mp3` });
      }
    }
    // ... rest of existing code ...
  } catch (error) {
    console.error('Error in text-to-speech endpoint:', error);
    res.status(500).json({ error: 'Text-to-speech conversion failed' });
  }
});
```

### 5. Add Dependencies to package.json

Add the Azure speech SDK to your project:

```json
"dependencies": {
  "microsoft-cognitiveservices-speech-sdk": "^1.31.0"
}
```

Install the dependencies:

```bash
npm install microsoft-cognitiveservices-speech-sdk
```
