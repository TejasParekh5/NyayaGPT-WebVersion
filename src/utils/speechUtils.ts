// Speech and language utilities for NyaySetu
import { useEffect, useRef, useState } from 'react';

export type AudioRecordingOptions = {
  sampleRate?: number;
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
}

export const useSpeechToText = (options: AudioRecordingOptions = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Clean up function
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, [isRecording]);

  // Start recording function
  const startRecording = async (language: string = 'en') => {
    setError(null);
    setTranscript('');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: options.echoCancellation ?? true,
          noiseSuppression: options.noiseSuppression ?? true,
          autoGainControl: options.autoGainControl ?? true,
          sampleRate: options.sampleRate ?? 44100,
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus', // More widely supported in browsers
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await processAudio(audioBlob, language);
        } catch (processError) {
          console.error("Error processing audio:", processError);
          setError("Error processing audio. Please try again.");
        } finally {
          setIsProcessing(false);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Automatically stop recording after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 10000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError("Could not access microphone. Please check permissions.");
    }
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };  // Process recorded audio
  const processAudio = async (audioBlob: Blob, language: string) => {
    // Convert blob to base64
    const reader = new FileReader();
    
    return new Promise<void>((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64Audio = reader.result?.toString().split(',')[1];
          
          if (base64Audio) {
            // Send to backend API for speech recognition
            const response = await fetch('http://localhost:5000/speech-to-text', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                audio: base64Audio,
                language: language,
              }),
              // Add timeout to prevent hanging if server doesn't respond
              signal: AbortSignal.timeout(30000)
            });
            
            // Check for non-JSON responses (like HTML error pages)
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              console.error('Received non-JSON response from server');
              console.error(`Content-Type: ${contentType}`);
              console.error(`Status: ${response.status}`);
              
              // Try to log the response body to help debug
              try {
                const text = await response.text();
                console.error(`Response body (first 500 chars): ${text.substring(0, 500)}`);
              } catch (e) {
                console.error('Could not read response body', e);
              }
              
              setError("Server error. Please try again later.");
              // Fall back to simulation instead of rejecting
              await simulateRecognition(language);
              resolve();
              return;
            }
            
            const data = await response.json();
            
            if (data.text) {
              setTranscript(data.text);
              resolve();
            } else if (data.error) {
              console.error("API returned error:", data.error);
              setError(data.error || "Could not recognize speech. Please try again.");
              // Fall back to simulation
              await simulateRecognition(language);
              resolve();
            } else {
              console.error("Unexpected API response:", data);
              setError("Could not recognize speech. Please try again.");
              // Fall back to simulation
              await simulateRecognition(language);
              resolve();
            }
          } else {
            setError("Could not process audio data.");
            // Fall back to simulation
            await simulateRecognition(language);
            resolve();
          }
        } catch (error) {
          console.error("Error in speech recognition:", error);
          setError("Error in speech recognition. Falling back to simulation.");
          // Fall back to simulation
          await simulateRecognition(language);
          resolve();
        }
      };
      
      reader.onerror = () => {
        setError("Error reading audio file.");
        // Fall back to simulation
        simulateRecognition(language).then(resolve).catch(reject);
      };
      
      reader.readAsDataURL(audioBlob);
    });
  };

  // Simulate speech recognition when real recognition fails or isn't available
  const simulateRecognition = async (language: string) => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('http://localhost:5000/speech-to-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          simulatedRequest: true,
          language: language,
        }),
      });
      
      const data = await response.json();
      
      if (data.text) {
        setTranscript(data.text);
      } else {
        setError("Simulation error. Please try again.");
      }
    } catch (error) {
      console.error("Error in simulated speech recognition:", error);
      setError("Simulation error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isRecording,
    transcript,
    error,
    isProcessing,
    startRecording,
    stopRecording,
    simulateRecognition
  };
};

export const useTextToSpeech = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Initialize audio element
    const audio = new Audio();
    audioRef.current = audio;
    
    // Clean up on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
    const speak = async (text: string, language: string = 'en') => {
    if (!text?.trim()) return;
    
    setError(null);
    setIsLoading(true);
    
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // Call backend TTS API
      const response = await fetch('http://localhost:5000/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language,
        }),
        // Add timeout to prevent hanging if server doesn't respond
        signal: AbortSignal.timeout(30000)
      });
      
      // Check for non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Received non-JSON response from TTS server');
        console.error(`Content-Type: ${contentType}`);
        console.error(`Status: ${response.status}`);
        
        // Try to log the response body to help debug
        try {
          const responseText = await response.text();
          console.error(`Response body (first 500 chars): ${responseText.substring(0, 500)}`);
        } catch (e) {
          console.error('Could not read response body', e);
        }
        
        throw new Error("Server returned invalid response");
      }
      
      const data = await response.json();
      
      if (data.audioUrl) {
        // Add a timestamp to the URL to prevent browser caching
        const timestamp = new Date().getTime();
        const audioUrlWithTimestamp = `http://localhost:5000${data.audioUrl}?t=${timestamp}`;
        
        setAudioUrl(audioUrlWithTimestamp);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrlWithTimestamp;
          
          // Add event listeners to detect and handle playback errors
          const playPromise = audioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Audio playback error:", error);
              setError(`Audio playback failed: ${error.message}. Please try again.`);
            });
          }
        }
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("No audio URL in response");
      }
    } catch (error) {
      console.error("Error in text-to-speech:", error);
      setError(`Could not convert text to speech: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };
  
  return {
    isLoading,
    audioUrl,
    error,
    speak,
    stop,
    audioRef
  };
};
