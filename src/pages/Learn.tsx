
import { useState } from "react";
import Layout from "../components/layout/Layout";
import { Play, BookOpen, GraduationCap, Award, Filter, ChevronRight, Star } from "lucide-react";

type ContentCategory = "all" | "video" | "natak" | "quiz" | "article";
type ContentLanguage = "all" | "en" | "hi" | "bn" | "ta" | "te";
type ContentTopic = "all" | "fir" | "property" | "consumer" | "marriage" | "labor";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: "video" | "natak" | "quiz" | "article";
  language: string;
  languageLabel: string;
  topic: string;
  topicLabel: string;
  duration?: string;
  thumbnail?: string;
  level?: "beginner" | "intermediate" | "advanced";
  xp?: number;
}

const Learn = () => {
  const [activeCategory, setActiveCategory] = useState<ContentCategory>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [languageFilter, setLanguageFilter] = useState<ContentLanguage>("all");
  const [topicFilter, setTopicFilter] = useState<ContentTopic>("all");

  const contentItems: ContentItem[] = [
    {
      id: "1",
      title: "Understanding FIR Filing Process",
      description: "Learn how to file a First Information Report at your local police station.",
      type: "video",
      language: "en",
      languageLabel: "English",
      topic: "fir",
      topicLabel: "FIR Process",
      duration: "12:34",
      thumbnail: "https://placehold.co/600x400/1A237E/FFFFFF.png?text=FIR+Filing",
      level: "beginner",
      xp: 100,
    },
    {
      id: "2",
      title: "दहेज़ निषेध अधिनियम की समझ",
      description: "भारतीय क़ानून में दहेज़ प्रतिबंध और महिला अधिकार।",
      type: "natak",
      language: "hi",
      languageLabel: "हिंदी",
      topic: "marriage",
      topicLabel: "Marriage Laws",
      duration: "28:45",
      thumbnail: "https://placehold.co/600x400/FF9800/FFFFFF.png?text=Dowry+Law",
      level: "intermediate",
      xp: 150,
    },
    {
      id: "3",
      title: "Consumer Rights Quiz",
      description: "Test your knowledge about consumer protection laws in India.",
      type: "quiz",
      language: "en",
      languageLabel: "English",
      topic: "consumer",
      topicLabel: "Consumer Rights",
      thumbnail: "https://placehold.co/600x400/4CAF50/FFFFFF.png?text=Consumer+Quiz",
      level: "beginner",
      xp: 75,
    },
    {
      id: "4",
      title: "Property Registration Process",
      description: "Complete guide to property registration and documentation requirements.",
      type: "article",
      language: "en",
      languageLabel: "English",
      topic: "property",
      topicLabel: "Property Law",
      duration: "10 min read",
      thumbnail: "https://placehold.co/600x400/9C27B0/FFFFFF.png?text=Property+Law",
      level: "advanced",
      xp: 120,
    },
    {
      id: "5",
      title: "তোমার অধিকার জানো",
      description: "আইনি সচেতনতা নাটক - গ্রেপ্তারের সময় আপনার অধিকার জানুন।",
      type: "natak",
      language: "bn",
      languageLabel: "বাংলা",
      topic: "fir",
      topicLabel: "Arrest Rights",
      duration: "32:10",
      thumbnail: "https://placehold.co/600x400/607D8B/FFFFFF.png?text=Arrest+Rights",
      level: "beginner",
      xp: 130,
    },
    {
      id: "6",
      title: "Labor Law Fundamentals",
      description: "Understanding worker rights, minimum wages, and workplace safety laws.",
      type: "video",
      language: "en",
      languageLabel: "English",
      topic: "labor",
      topicLabel: "Labor Law",
      duration: "18:22",
      thumbnail: "https://placehold.co/600x400/795548/FFFFFF.png?text=Labor+Law",
      level: "intermediate",
      xp: 110,
    },
  ];

  const categories = [
    { id: "all", label: "All", icon: BookOpen },
    { id: "video", label: "Videos", icon: Play },
    { id: "natak", label: "Legal Plays", icon: GraduationCap },
    { id: "quiz", label: "Quizzes", icon: Award },
    { id: "article", label: "Articles", icon: BookOpen },
  ];

  const languages = [
    { id: "all", label: "All Languages" },
    { id: "en", label: "English" },
    { id: "hi", label: "हिंदी (Hindi)" },
    { id: "bn", label: "বাংলা (Bengali)" },
    { id: "ta", label: "தமிழ் (Tamil)" },
    { id: "te", label: "తెలుగు (Telugu)" },
  ];

  const topics = [
    { id: "all", label: "All Topics" },
    { id: "fir", label: "FIR & Police Procedures" },
    { id: "property", label: "Property Law" },
    { id: "consumer", label: "Consumer Rights" },
    { id: "marriage", label: "Family & Marriage Law" },
    { id: "labor", label: "Labor & Employment" },
  ];

  const filteredContent = contentItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.type === activeCategory;
    const matchesLanguage = languageFilter === "all" || item.language === languageFilter;
    const matchesTopic = topicFilter === "all" || item.topic === topicFilter;
    return matchesCategory && matchesLanguage && matchesTopic;
  });

  const ContentCard = ({ item }: { item: ContentItem }) => {
    let typeIcon;
    let typeColor;

    switch (item.type) {
      case "video":
        typeIcon = <Play className="mr-1" size={14} />;
        typeColor = "bg-red-100 text-red-700";
        break;
      case "natak":
        typeIcon = <GraduationCap className="mr-1" size={14} />;
        typeColor = "bg-purple-100 text-purple-700";
        break;
      case "quiz":
        typeIcon = <Award className="mr-1" size={14} />;
        typeColor = "bg-green-100 text-green-700";
        break;
      case "article":
        typeIcon = <BookOpen className="mr-1" size={14} />;
        typeColor = "bg-blue-100 text-blue-700";
        break;
    }

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative">
          <img src={item.thumbnail} alt={item.title} className="w-full h-48 object-cover" />
          {item.duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {item.duration}
            </div>
          )}
          <div className="absolute bottom-2 left-2 flex space-x-2">
            <div className={`${typeColor} px-2 py-1 rounded text-xs font-medium flex items-center`}>
              {typeIcon}
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-judicial-blue line-clamp-2">{item.title}</h3>
            {item.xp && (
              <div className="flex items-center text-yellow-600 text-sm">
                <Star className="w-4 h-4 fill-yellow-500 stroke-yellow-600" />
                <span className="ml-1">{item.xp} XP</span>
              </div>
            )}
          </div>
          <p className="text-judicial-gray text-sm mt-2 line-clamp-2">{item.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-judicial-gray">
              {item.languageLabel}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-judicial-gray">
              {item.topicLabel}
            </span>
            {item.level && (
              <span 
                className={`text-xs px-2 py-1 rounded-full ${
                  item.level === 'beginner' ? 'bg-green-100 text-green-700' : 
                  item.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-red-100 text-red-700'
                }`}
              >
                {item.level.charAt(0).toUpperCase() + item.level.slice(1)}
              </span>
            )}
          </div>
          <button className="mt-4 text-judicial-orange hover:text-judicial-blue flex items-center text-sm font-medium transition-colors">
            View Content <ChevronRight className="ml-1 w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-judicial-blue to-blue-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Legal Awareness Center
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Explore our library of legal resources, videos, interactive plays, and quizzes to enhance your understanding of Indian law.
          </p>
        </div>
      </section>

      {/* Learning Categories */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-4 hide-scrollbar">
            <div className="flex space-x-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id as ContentCategory)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors flex items-center ${
                      activeCategory === category.id
                        ? "bg-judicial-blue text-white"
                        : "bg-gray-100 text-judicial-gray hover:bg-gray-200"
                    }`}
                  >
                    <Icon size={16} className="mr-2" />
                    {category.label}
                  </button>
                );
              })}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 rounded-full whitespace-nowrap bg-gray-100 text-judicial-gray hover:bg-gray-200 transition-colors flex items-center ml-2"
              >
                <Filter size={16} className="mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters - Collapsible */}
      {showFilters && (
        <section className="bg-gray-50 border-b py-4">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-judicial-gray mb-2">Language</label>
                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value as ContentLanguage)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-judicial-blue"
                >
                  {languages.map((language) => (
                    <option key={language.id} value={language.id}>
                      {language.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-judicial-gray mb-2">Topic</label>
                <select
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value as ContentTopic)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-judicial-blue"
                >
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setLanguageFilter("all");
                    setTopicFilter("all");
                  }}
                  className="text-judicial-blue hover:text-judicial-orange transition-colors text-sm"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          {filteredContent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-serif text-judicial-blue mb-2">No content found</h3>
              <p className="text-judicial-gray">
                Try adjusting your filters to see more content.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Natak Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <h2 className="section-title">Featured Legal Play (Natak)</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://placehold.co/800x450/1A237E/FFFFFF.png?text=Legal+Natak" 
                alt="Legal Play Preview" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 rounded-full bg-judicial-orange flex items-center justify-center text-white hover:bg-opacity-90 transition-all">
                  <Play size={30} className="ml-1" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6">
                <h3 className="text-xl font-serif">नारी अधिकार: एक जागृति</h3>
                <p className="text-sm opacity-90">A legal awareness play about women's rights in India</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-serif text-judicial-blue mb-4">
                Learn Through Regional Legal Plays
              </h3>
              <p className="text-judicial-gray mb-6">
                Our "Natak Library" features legal awareness plays in multiple Indian languages, making complex legal concepts accessible through engaging storytelling and familiar cultural contexts.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-judicial-blue mb-2">Key Benefits:</h4>
                <ul className="list-disc pl-5 space-y-2 text-judicial-gray">
                  <li>Culturally relevant legal education</li>
                  <li>Available in 10+ regional languages</li>
                  <li>Covers everyday legal scenarios</li>
                  <li>Visually engaging format for better retention</li>
                  <li>Downloadable for offline viewing</li>
                </ul>
              </div>
              <button className="btn-primary">
                Explore Natak Library
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gamified Learning Promo */}
      <section className="section-padding bg-gradient-to-br from-judicial-blue to-blue-900 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                Learn Law Through Interactive Games
              </h2>
              <p className="text-xl text-gray-200 mb-6">
                Test your legal knowledge and earn XP points through our gamified learning modules.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                    <Award size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Earn Badges</h3>
                    <p className="text-gray-200 text-sm">Complete quizzes to unlock achievement badges</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Track Progress</h3>
                    <p className="text-gray-200 text-sm">Follow your legal literacy journey</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                    <Star size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">XP Points</h3>
                    <p className="text-gray-200 text-sm">Gain experience points as you learn</p>
                  </div>
                </div>
              </div>
              <button className="bg-white text-judicial-blue hover:bg-gray-100 font-medium px-6 py-3 rounded-md transition-all">
                Start Earning XP
              </button>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl relative">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-judicial-orange rounded-full flex items-center justify-center text-white font-bold text-xl">
                  XP
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-white">Legal Rights Quiz</h3>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-white mb-3">Which of these is NOT a fundamental right under the Indian Constitution?</p>
                    <div className="space-y-2">
                      <button className="w-full text-left p-2 rounded bg-white/5 hover:bg-white/20 transition-colors text-white text-sm">
                        A. Right to Equality
                      </button>
                      <button className="w-full text-left p-2 rounded bg-white/5 hover:bg-white/20 transition-colors text-white text-sm">
                        B. Right to Freedom
                      </button>
                      <button className="w-full text-left p-2 rounded bg-white/5 hover:bg-white/20 transition-colors text-white text-sm">
                        C. Right to Property
                      </button>
                      <button className="w-full text-left p-2 rounded bg-white/5 hover:bg-white/20 transition-colors text-white text-sm">
                        D. Right against Exploitation
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-white">
                      <span className="text-sm">Question 3 of 10</span>
                      <div className="w-full bg-white/10 h-2 rounded-full mt-1">
                        <div className="bg-judicial-orange h-2 rounded-full" style={{ width: "30%" }}></div>
                      </div>
                    </div>
                    <button className="bg-judicial-orange text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors text-sm">
                      Next Question
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Learn;
