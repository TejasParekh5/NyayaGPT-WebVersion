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
  "How do I file an FIR?",
  "What are my rights if I am arrested?",
  "How can I apply for legal aid in India?",
  "What are the steps for filing a consumer complaint?",
  "What documents are needed for property registration?",
  "मुझे FIR दर्ज करने के बारे में जानकारी चाहिए",
  "संपत्ति पंजीकरण के लिए क्या दस्तावेज़ आवश्यक हैं?",
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null); // NEW: ref for chat container

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
    // Scroll only the chat container, not the whole page
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput("");
    
    // Simulate bot thinking
    setIsTyping(true);
    
    // Simulate bot response (in a real app, this would be an API call)
    setTimeout(() => {
      const botReply = generateSimpleResponse(input);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botReply,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents page scroll/jump
    handleSendMessage();
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop speech recognition
    if (!isRecording) {
      // Simulate voice input
      setTimeout(() => {
        setInput("How do I file a consumer complaint?");
        setIsRecording(false);
      }, 2000);
    }
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    // In a real app, this would start/stop text-to-speech
  };

  const handleSampleQuery = (query: string) => {
    setInput(query);
  };

  // Very simple response generator for demo purposes
  const generateSimpleResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("fir") || lowerInput.includes("complaint")) {
      return "To file an FIR (First Information Report), you need to visit the nearest police station where the incident occurred. Provide all details of the incident, including date, time, location, and description. The police officer is legally obligated to register your complaint. You'll receive a copy of the FIR for your records. If the police refuse to file your FIR, you can approach the Superintendent of Police or file a complaint to the magistrate under Section 156(3) of CrPC.";
    } else if (lowerInput.includes("arrest") || lowerInput.includes("rights")) {
      return "If you are arrested, you have the following rights: 1) Right to know the grounds of arrest, 2) Right to inform a relative/friend, 3) Right to meet a lawyer of your choice, 4) Right to be produced before a magistrate within 24 hours, 5) Right to medical examination, 6) Right to not be detained for more than 24 hours without judicial authorization, 7) Right to apply for bail. These rights are guaranteed under Article 22 of the Constitution and Sections 50-54 of CrPC.";
    } else if (lowerInput.includes("legal aid")) {
      return "To apply for legal aid in India, approach your nearest District Legal Services Authority (DLSA) or State Legal Services Authority (SLSA). Fill out the application form and provide proof of eligibility (income certificate, caste certificate if applicable, or proof of belonging to special categories). Legal aid is free for women, children, SC/ST communities, victims of mass disasters, industrial workmen, and persons with disabilities. Others can qualify if their annual income is below the threshold set by the respective State Legal Services Authority.";
    } else if (lowerInput.includes("property") || lowerInput.includes("registration")) {
      return "For property registration in India, you need: 1) Sale deed or transfer document, 2) Property title documents, 3) Approval plans from local authorities, 4) Tax receipts showing payment of property tax, 5) NOC from housing society (if applicable), 6) Identity proof of all parties, 7) Photographs of all parties. The registration process involves payment of stamp duty and registration fees, which vary by state. The document must be registered within 4 months of execution at the Sub-Registrar's office having jurisdiction over the property's location.";
    } else if (lowerInput.includes("consumer")) {
      return "To file a consumer complaint: 1) Write a formal complaint to the service provider/seller first. 2) If unsatisfied with the response, file a complaint with the appropriate Consumer Dispute Redressal Commission based on the value of goods/services: District Commission (up to ₹1 crore), State Commission (₹1-10 crore), or National Commission (above ₹10 crore). 3) Submit your complaint with relevant documents, including proof of transaction, within 2 years of the cause of action. Online filing is available at e-daakhil portal (https://edaakhil.nic.in).";
    } else {
      return "Thank you for your query. In a fully implemented version, I would provide accurate legal information on this topic. For now, please try asking about filing an FIR, your rights when arrested, applying for legal aid, consumer complaints, or property registration.";
    }
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
                    >
                      {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-judicial-gray">Text-to-Speech</span>
                    <button
                      onClick={toggleSpeaking}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isSpeaking ? "bg-judicial-blue text-white" : "bg-gray-100 text-judicial-gray"
                      }`}
                    >
                      {isSpeaking ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>
                  </div>
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
                  ref={chatContainerRef} // Attach ref here
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
                        <p>{message.text}</p>
                        <div
                          className={`text-xs mt-1 ${
                            message.sender === "user" ? "text-blue-100" : "text-gray-400"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
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

              {/* Disclaimer */}
              <div className="mt-4 text-sm text-judicial-gray bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                <p><strong>Disclaimer:</strong> This AI assistant provides general legal information, not legal advice. For specific legal advice tailored to your situation, please consult a qualified legal professional.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Chatbot;
