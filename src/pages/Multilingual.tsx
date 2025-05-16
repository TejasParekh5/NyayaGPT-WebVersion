
import { useState } from "react";
import Layout from "../components/layout/Layout";
import { Globe, Mic, Volume2, MessageSquare, Languages } from "lucide-react";

const Multilingual = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "hi", name: "Hindi", native: "हिंदी" },
    { code: "bn", name: "Bengali", native: "বাংলা" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "te", name: "Telugu", native: "తెలుగు" },
    { code: "mr", name: "Marathi", native: "मराठी" },
    { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", native: "മലയാളം" },
    { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
    { code: "ur", name: "Urdu", native: "اردو" },
    { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  ];

  const legalPhrases = {
    en: [
      { phrase: "I need to file a police complaint", translation: "I need to file a police complaint" },
      { phrase: "What are my consumer rights?", translation: "What are my consumer rights?" },
      { phrase: "How to apply for legal aid", translation: "How to apply for legal aid" },
    ],
    hi: [
      { phrase: "I need to file a police complaint", translation: "मुझे पुलिस में शिकायत दर्ज करनी है" },
      { phrase: "What are my consumer rights?", translation: "मेरे उपभोक्ता अधिकार क्या हैं?" },
      { phrase: "How to apply for legal aid", translation: "कानूनी सहायता के लिए आवेदन कैसे करें" },
    ],
    bn: [
      { phrase: "I need to file a police complaint", translation: "আমাকে একটি পুলিশ অভিযোগ দায়ের করতে হবে" },
      { phrase: "What are my consumer rights?", translation: "আমার ভোক্তা অধিকারগুলি কী কী?" },
      { phrase: "How to apply for legal aid", translation: "আইনি সহায়তার জন্য কীভাবে আবেদন করতে হয়" },
    ]
  };

  const getLegalPhrases = () => {
    return legalPhrases[selectedLanguage as keyof typeof legalPhrases] || legalPhrases.en;
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-judicial-blue to-blue-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <Globe className="text-white" size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Multilingual Legal Access
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Access legal information in 22+ Indian languages, breaking down barriers to justice.
          </p>
          <div className="text-2xl font-serif italic">
            "Your Rights. Your Language."
          </div>
        </div>
      </section>

      {/* Language Selection */}
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <h2 className="section-title text-center mx-auto after:left-1/2 after:-translate-x-1/2">
            Choose Your Language
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => setSelectedLanguage(language.code)}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedLanguage === language.code
                      ? "border-judicial-orange bg-judicial-orange/5 shadow-md"
                      : "border-gray-200 hover:border-judicial-blue/30 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium text-judicial-blue">{language.native}</div>
                  <div className="text-sm text-judicial-gray">{language.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Translation Demo */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <h2 className="section-title text-center mx-auto after:left-1/2 after:-translate-x-1/2">
            Instant Translation Demo
          </h2>
          
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 p-4 bg-gray-50">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-judicial-blue rounded-full flex items-center justify-center text-white mr-3">
                    <Languages size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-judicial-blue">Bhashini API Integration</h3>
                    <p className="text-sm text-judicial-gray">Powered by Bhashini for accurate legal translations</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {getLegalPhrases().map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-judicial-gray">English</div>
                        <button className="text-judicial-blue hover:text-judicial-orange">
                          <Volume2 size={16} />
                        </button>
                      </div>
                      <p className="font-medium mb-4">{item.phrase}</p>
                      
                      <div className="border-t border-gray-200 my-3"></div>
                      
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm text-judicial-gray">
                          {languages.find(lang => lang.code === selectedLanguage)?.name || "Translation"}
                        </div>
                        <button className="text-judicial-blue hover:text-judicial-orange">
                          <Volume2 size={16} />
                        </button>
                      </div>
                      <p className="font-medium">{item.translation}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex">
                  <button className="flex items-center justify-center bg-judicial-blue hover:bg-opacity-90 text-white px-4 py-3 rounded-md transition-all hover:shadow-lg w-full">
                    <Mic size={18} className="mr-2" />
                    Try Voice Translation
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-serif text-judicial-blue mb-4">Breaking Language Barriers</h3>
              <p className="text-judicial-gray mb-4">
                NyaySetu leverages Bhashini, India's AI-powered language translation platform, to provide seamless translation services across 22+ Indian languages. Our platform enables:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-judicial-gray">
                <li>Real-time text translation of legal terms and concepts</li>
                <li>Speech-to-text in multiple Indian languages</li>
                <li>Text-to-speech for accessibility</li>
                <li>Preservation of legal meaning across translations</li>
                <li>Culturally appropriate legal terminology</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Language Support */}
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="section-title">Voice Support for All</h2>
              <div className="space-y-4 text-judicial-gray">
                <p>
                  Our comprehensive voice support system enables users who may not be comfortable with reading or typing to interact with our platform naturally.
                </p>
                <div className="space-y-2 mt-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-judicial-blue/10 rounded-full flex items-center justify-center">
                      <Mic size={20} className="text-judicial-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-judicial-blue">Speech-to-Text</h3>
                      <p className="text-sm text-judicial-gray">Speak in your language to get legal information</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-judicial-blue/10 rounded-full flex items-center justify-center">
                      <Volume2 size={20} className="text-judicial-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-judicial-blue">Text-to-Speech</h3>
                      <p className="text-sm text-judicial-gray">Listen to legal guidance in your preferred language</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-judicial-blue/10 rounded-full flex items-center justify-center">
                      <MessageSquare size={20} className="text-judicial-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-judicial-blue">Conversational Interface</h3>
                      <p className="text-sm text-judicial-gray">Natural dialogue for complex legal queries</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-[400px] rounded-lg bg-gray-100 overflow-hidden shadow-xl">
                <div className="absolute top-0 left-0 w-full h-12 bg-judicial-blue flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-white text-sm mx-auto">Voice Assistant Demo</div>
                </div>
                <div className="pt-16 p-6 flex flex-col h-full">
                  <div className="flex-1 space-y-6">
                    <div className="flex justify-center">
                      <div className="w-24 h-24 bg-judicial-blue rounded-full flex items-center justify-center animate-pulse">
                        <Volume2 size={40} className="text-white" />
                      </div>
                    </div>
                    <div className="text-center text-judicial-blue font-medium">
                      "मुझे संपत्ति विवाद के बारे में जानकारी चाहिए"
                    </div>
                    <div className="text-center text-sm text-judicial-gray">
                      Listening and translating...
                    </div>
                    <div className="text-center text-judicial-blue font-medium mt-4">
                      "I need information about property disputes"
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className="bg-judicial-blue text-white p-3 rounded-lg">
                      <p className="text-sm">
                        For property disputes in India, you can approach the civil courts or consider alternative dispute resolution methods like mediation. Would you like me to explain the legal process in more detail?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-judicial-orange rounded-full flex items-center justify-center text-white z-10 shadow-lg transform rotate-12">
                <div className="text-center">
                  <div className="font-bold text-sm">22+</div>
                  <div className="text-xs">Languages</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-judicial-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
              Experience Legal Support in Your Language
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Try our multilingual legal assistant and access justice without language barriers.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="btn-primary">
                Try the Chatbot
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Multilingual;
