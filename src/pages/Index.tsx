import { Link } from "react-router-dom";
import { Scale, MessageSquare, Book, User } from "lucide-react";
import Layout from "../components/layout/Layout";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-judicial-blue to-blue-900 text-white py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight">
                Justice in Your Language, <span className="text-judicial-orange">Instantly.</span>
              </h1>
              <p className="text-xl text-gray-200">
                Access legal information in your preferred language, powered by AI to bridge the legal literacy gap across India.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/chatbot" className="btn-primary">Try Demo Chatbot</Link>
                <Link to="/learn" className="bg-transparent border-2 border-white hover:border-judicial-orange text-white font-medium px-6 py-3 rounded-md transition-all">
                  Explore Legal Help
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="w-full h-[400px] bg-white/10 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-12 bg-judicial-blue/30 backdrop-blur-sm flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="p-6 pt-16">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-judicial-orange flex items-center justify-center text-white">
                        <User size={20} />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                        <p className="text-judicial-gray">मुझे FIR दर्ज करने के बारे में जानकारी चाहिए</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-judicial-blue flex items-center justify-center text-white">
                        <MessageSquare size={20} />
                      </div>
                      <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
                        <p className="text-judicial-gray">FIR (प्रथम सूचना रिपोर्ट) एक लिखित दस्तावेज है जो पुलिस द्वारा किसी अपराध की सूचना मिलने पर तैयार किया जाता है। आप निम्न तरीकों से FIR दर्ज करा सकते हैं...</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-judicial-orange flex items-center justify-center text-white">
                        <User size={20} />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                        <p className="text-judicial-gray">What documents do I need to file an FIR?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-4xl font-serif text-judicial-blue mb-2">70%</h3>
              <p className="text-judicial-gray">Indians lack access to proper legal aid</p>
            </div>
            <div className="p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-4xl font-serif text-judicial-blue mb-2">22+</h3>
              <p className="text-judicial-gray">Languages supported for legal assistance</p>
            </div>
            <div className="p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-4xl font-serif text-judicial-blue mb-2">24/7</h3>
              <p className="text-judicial-gray">Instant legal information access</p>
            </div>
            <div className="p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-4xl font-serif text-judicial-blue mb-2">50K+</h3>
              <p className="text-judicial-gray">Legal queries answered monthly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <h2 className="section-title text-center mx-auto after:left-1/2 after:-translate-x-1/2">
            How NyaySetu Empowers You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Feature 1 */}
            <div className="card animate-scale-in">
              <div className="w-14 h-14 bg-judicial-blue/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare size={28} className="text-judicial-blue" />
              </div>
              <h3 className="text-xl font-serif text-judicial-blue mb-3">Multilingual Legal Chatbot</h3>
              <p className="text-judicial-gray mb-4">
                Get instant legal guidance in your preferred language through our AI-powered chatbot that understands 22+ Indian languages.
              </p>
              <Link to="/chatbot" className="text-judicial-orange font-medium hover:underline inline-flex items-center">
                Try Now <span className="ml-1">→</span>
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="card animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-14 h-14 bg-judicial-blue/10 rounded-lg flex items-center justify-center mb-4">
                <Book size={28} className="text-judicial-blue" />
              </div>
              <h3 className="text-xl font-serif text-judicial-blue mb-3">Legal Literacy Content</h3>
              <p className="text-judicial-gray mb-4">
                Access simplified legal information through videos, plays, and interactive content in multiple languages.
              </p>
              <Link to="/learn" className="text-judicial-orange font-medium hover:underline inline-flex items-center">
                Start Learning <span className="ml-1">→</span>
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="card animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-14 h-14 bg-judicial-blue/10 rounded-lg flex items-center justify-center mb-4">
                <Scale size={28} className="text-judicial-blue" />
              </div>
              <h3 className="text-xl font-serif text-judicial-blue mb-3">Legal Aid Connection</h3>
              <p className="text-judicial-gray mb-4">
                Connect with NALSA representatives, legal aid NGOs, and pro-bono lawyers in your region and language.
              </p>
              <Link to="/legal-aid" className="text-judicial-orange font-medium hover:underline inline-flex items-center">
                Find Help <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-judicial-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
              Ready to understand your legal rights?
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Try our AI-powered legal assistant today and get instant, reliable legal information in your language.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/chatbot" className="btn-primary">
                Start Using NyaySetu
              </Link>
              <Link to="/about" className="bg-transparent border-2 border-white hover:border-judicial-orange text-white font-medium px-6 py-3 rounded-md transition-all">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
