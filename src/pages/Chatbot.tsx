import { useState, useRef, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { Send, Mic, MicOff, Volume2, VolumeX, MessageSquare, Loader2 } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const SampleQueries = [
  // English
  "How do I file an FIR?",
  "What are my rights if I am arrested?",
  "How can I apply for legal aid in India?",
  "What are the steps for filing a consumer complaint?",
  "What documents are needed for property registration?",
  // Hindi
  "मुझे FIR दर्ज करने के बारे में जानकारी चाहिए",
  "संपत्ति पंजीकरण के लिए क्या दस्तावेज़ आवश्यक हैं?",
  // Bengali
  "আমি কিভাবে একটি FIR দাখিল করব?",
  // Tamil
  "கைது செய்யப்பட்டால் என் உரிமைகள் என்ன?",
  // Telugu
  "భారతదేశంలో ఉచిత చట్ట సహాయం కోసం నేను ఎలా దరఖాస్తు చేసుకోవాలి?",
];

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI legal assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  
  // Audio elements
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null); 

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी (Hindi)" },
    { code: "bn", name: "বাংলা (Bengali)" },
    { code: "ta", name: "தமிழ் (Tamil)" },
    { code: "te", name: "తెలుగు (Telugu)" },
    { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
    { code: "ml", name: "മലയാളം (Malayalam)" },
    { code: "mr", name: "मराठी (Marathi)" },
    { code: "gu", name: "ગુજરાતી (Gujarati)" },
    { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)" },
  ];

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize audio context and speech recognition
  useEffect(() => {
    // Create audio element for TTS playback
    const audio = new Audio();
    audioRef.current = audio;
    
    // Clean up on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopRecording();
    };
  }, []);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    // Call backend API for bot response
    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, language: selectedLanguage }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      const botMessage: Message = {
        id: messages.length + 2,
        text: data.reply,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      
      // If text-to-speech is active, speak the response
      if (isSpeaking) {
        speakText(data.reply);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: messages.length + 2,
          text: "Sorry, there was an error connecting to the server.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
    
    setIsTyping(false);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendMessage();
  };
  // Function to start recording audio
  const startRecording = async () => {
    setRecognitionError(null);
    try {
      // First try to get microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Set a timeout to automatically stop recording after 5 seconds
      // This is for demonstration purposes only and should be changed in production
      setTimeout(() => {
        if (isRecording && mediaRecorderRef.current) {
          stopRecording();
        }
      }, 5000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setRecognitionError("Could not access microphone. Please check permissions.");
      
      // If we can't access the microphone, we'll simulate recording
      setIsRecording(true);
      setTimeout(() => {
        // Simulate processing with backend
        setIsRecording(false);
        simulateSpeechRecognition();
      }, 3000);
    }
  };

  // Function to stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Also stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  // Simulate speech recognition when we can't access the microphone
  const simulateSpeechRecognition = async () => {
    try {
      setIsTyping(true);
      
      // Call our backend to get simulated text
      const response = await fetch('http://localhost:5000/speech-to-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          simulatedRequest: true,
          language: selectedLanguage,
        }),
      });
      
      const data = await response.json();
      
      if (data.text) {
        setInput(data.text);
        setTimeout(() => {
          handleSendMessage();
        }, 500);
      } else {
        setRecognitionError("Could not recognize speech. Please try again.");
      }
      
      setIsTyping(false);
    } catch (error) {
      console.error("Error in simulated speech recognition:", error);
      setRecognitionError("Error processing speech. Please try again.");
      setIsTyping(false);
    }
  };

  // Process recorded audio for speech-to-text conversion
  const processAudio = async (audioBlob: Blob) => {
    try {
      setIsTyping(true); // Show typing indicator while processing
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        if (base64Audio) {
          // Send to our API for speech recognition
          const response = await fetch('http://localhost:5000/speech-to-text', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              audio: base64Audio,
              language: selectedLanguage,
            }),
          });
          
          const data = await response.json();
          
          if (data.text) {
            setInput(data.text);
            setTimeout(() => {
              handleSendMessage();
            }, 500);
          } else {
            setRecognitionError("Could not recognize speech. Please try again.");
          }
        }
        setIsTyping(false);
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error("Error processing audio:", error);
      setRecognitionError("Error processing audio. Please try again.");
      setIsTyping(false);
    }
  };

  // Toggle recording state
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Text-to-Speech functionality
  const speakText = async (text: string) => {
    if (!text) return;
    
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // Call text-to-speech API
      const response = await fetch('http://localhost:5000/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language: selectedLanguage,
        }),
      });
      
      const data = await response.json();
      
      // If we have a real audio URL (not from placeholder response)
      if (data.audioUrl) {
        setAudioUrl(`http://localhost:5000${data.audioUrl}`);
        if (audioRef.current) {
          audioRef.current.src = `http://localhost:5000${data.audioUrl}`;
          audioRef.current.play();
        }
      }
    } catch (error) {
      console.error("Error in text-to-speech:", error);
    }
  };

  // Toggle speaking state and speak the last bot message if enabled
  const toggleSpeaking = () => {
    const newSpeakingState = !isSpeaking;
    setIsSpeaking(newSpeakingState);
    
    if (newSpeakingState) {
      // Find the last bot message and speak it
      const lastBotMessage = [...messages].reverse().find(msg => msg.sender === 'bot');
      if (lastBotMessage) {
        speakText(lastBotMessage.text);
      }
    } else if (audioRef.current) {
      // Stop speaking
      audioRef.current.pause();
    }
  };

  const handleSampleQuery = (query: string) => {
    setInput(query);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-judicial-blue to-blue-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif mb-4 text-white">Legal Assistance Chatbot</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Get instant legal guidance in your language through our AI-powered assistant.
          </p>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Language Selection & Tips */}
            <div className="lg:col-span-1 space-y-6">
              {/* Language Selection */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-serif text-judicial-blue mb-4">Select Language</h3>
                <div className="mb-4">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-judicial-blue"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-judicial-gray">
                  Choose your preferred language for both text and voice interaction.
                </p>
              </div>

              {/* Sample Queries */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-serif text-judicial-blue mb-4">Sample Queries</h3>
                <ul className="space-y-2">
                  {SampleQueries.map((query, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleSampleQuery(query)}
                        className="text-left text-judicial-blue hover:text-judicial-orange transition-colors w-full text-sm py-1 flex items-center"
                      >
                        <span className="mr-2">→</span> {query}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Accessibility Options */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-serif text-judicial-blue mb-4">Accessibility</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-judicial-gray">Voice Input</span>
                    <button
                      onClick={toggleRecording}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isRecording ? "bg-red-500 text-white" : "bg-gray-100 text-judicial-gray"
                      }`}
                      aria-label={isRecording ? "Stop recording" : "Start recording"}
                    >
                      {isRecording ? <Loader2 className="animate-spin" size={18} /> : <Mic size={18} />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-judicial-gray">Text-to-Speech</span>
                    <button
                      onClick={toggleSpeaking}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isSpeaking ? "bg-judicial-blue text-white" : "bg-gray-100 text-judicial-gray"
                      }`}
                      aria-label={isSpeaking ? "Turn off text-to-speech" : "Turn on text-to-speech"}
                    >
                      {isSpeaking ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>
                  </div>
                  {recognitionError && (
                    <div className="text-red-500 text-sm mt-2">{recognitionError}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Chat Interface */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 flex flex-col h-[70vh]">
                {/* Chat Header */}
                <div className="bg-judicial-blue text-white p-4 flex items-center">
                  <MessageSquare size={20} className="mr-2" />
                  <h3 className="font-medium">NyaySetu Legal Assistant</h3>
                </div>

                {/* Messages Container */}
                <div
                  className="flex-1 overflow-y-auto p-4 bg-gray-50"
                  ref={chatContainerRef}
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg max-w-[75%] ${
                          message.sender === "user"
                            ? "bg-judicial-blue text-white"
                            : "bg-white text-judicial-gray border border-gray-200 shadow-sm"
                        }`}
                      >
                        <p>{message.text}</p>                        <div
                          className={`text-xs mt-1 ${
                            message.sender === "user" ? "text-blue-100" : "text-gray-400"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            
                            {/* Add speak button for bot messages */}
                            {message.sender === "bot" && (
                              <div className="flex items-center">
                                <button 
                                  onClick={() => speakText(message.text)}
                                  className="ml-2 text-judicial-blue hover:text-judicial-orange"
                                  aria-label="Speak this message"
                                >
                                  <Volume2 size={12} />
                                </button>
                                {/* Bhashini API indicator */}
                                <span className="ml-2 text-xs italic text-judicial-blue">
                                  via Bhashini API
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start mb-4">
                      <div className="p-3 rounded-lg bg-white text-judicial-gray border border-gray-200 shadow-sm">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef}></div>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <form onSubmit={handleFormSubmit}>
                    <div className="flex items-center">
                      <button 
                        onClick={toggleRecording}
                        type="button"
                        className={`p-2 rounded-full mr-2 ${
                          isRecording ? "text-red-500" : "text-gray-400 hover:text-judicial-blue"
                        }`}
                      >
                        {isRecording ? <Loader2 className="animate-spin" size={20} /> : <Mic size={20} />}
                      </button>
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Type your legal query in ${languages.find(l => l.code === selectedLanguage)?.name}...`}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-judicial-blue"
                      />
                      <button
                        type="submit"
                        disabled={input.trim() === ""}
                        className={`p-2 rounded-full ml-2 ${
                          input.trim() === ""
                            ? "text-gray-300"
                            : "text-judicial-blue hover:bg-judicial-blue/10"
                        }`}
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Disclaimer and API info */}
              <div className="mt-4 space-y-3">
                <div className="text-sm text-judicial-gray bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                  <p><strong>Disclaimer:</strong> This AI assistant provides general legal information, not legal advice. For specific legal advice tailored to your situation, please consult a qualified legal professional.</p>
                </div>
                <div className="text-sm text-judicial-gray bg-blue-50 border border-blue-200 p-3 rounded-md flex items-center">
                  <div className="mr-2">
                    <img src="https://bhashini.gov.in/images/logo.svg" alt="Bhashini Logo" className="h-5" />
                  </div>
                  <p>Powered by <strong>Bhashini API</strong> - India's digital language translation platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Hidden audio element for playing TTS */}
      <audio ref={audioRef} className="hidden" />
    </Layout>
  );
};

export default Chatbot;
