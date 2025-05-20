
import { useState } from "react";
import Layout from "../components/layout/Layout";
import { UserIcon, Settings, Award, ChevronRight, BookOpen, Star, BarChart3, Clock } from "lucide-react";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("progress");

  // Mock user data
  const userData = {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    preferredLanguage: "Hindi",
    joinedDate: "January 2024",
    level: 4,
    xp: 450,
    xpToNextLevel: 500,
    completedLessons: 23,
    quizzesTaken: 8,
    badges: [
      { id: "1", name: "Legal Rookie", description: "Completed your first legal course", icon: "🔍", earned: true },
      { id: "2", name: "Constitution Expert", description: "Scored 90%+ in Constitution quiz", icon: "📜", earned: true },
      { id: "3", name: "Legal Eagle", description: "Completed 10 legal lessons", icon: "🦅", earned: true },
      { id: "4", name: "Multilingual Master", description: "Used content in 3+ languages", icon: "🗣️", earned: false },
      { id: "5", name: "Consumer Champion", description: "Completed all consumer rights modules", icon: "🛒", earned: false },
      { id: "6", name: "Legal Scholar", description: "Earned 1000 XP", icon: "🎓", earned: false },
    ],
    recentActivity: [
      { id: "1", title: "Completed 'FIR Filing Process' video", type: "video", timestamp: "2 days ago", xp: 50 },
      { id: "2", title: "Earned 'Legal Rookie' badge", type: "badge", timestamp: "5 days ago", xp: 100 },
      { id: "3", title: "Scored 85% on Property Law Quiz", type: "quiz", timestamp: "1 week ago", xp: 75 },
      { id: "4", title: "Watched 'दहेज़ निषेध अधिनियम' legal play", type: "natak", timestamp: "2 weeks ago", xp: 60 },
    ],
    recommendations: [
      { 
        id: "1", 
        title: "Consumer Rights Deep Dive", 
        type: "course", 
        description: "Based on your interest in consumer protection", 
        thumbnail: "https://placehold.co/200x120/4CAF50/FFFFFF.png?text=Consumer",
        progress: 0
      },
      { 
        id: "2", 
        title: "Understanding Rental Agreements", 
        type: "video", 
        description: "Recommended follow-up to property law content", 
        thumbnail: "https://placehold.co/200x120/9C27B0/FFFFFF.png?text=Rental",
        progress: 0
      },
      { 
        id: "3", 
        title: "Legal Terminology Quiz", 
        type: "quiz", 
        description: "Test your knowledge of legal terms", 
        thumbnail: "https://placehold.co/200x120/FF5722/FFFFFF.png?text=Quiz",
        progress: 0
      },
    ]
  };

  return (
    <Layout>
      {/* Profile Header */}
      <section className="bg-gradient-to-br from-judicial-blue to-blue-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <UserIcon size={64} className="text-white/70" />
              </div>
              <div className="absolute bottom-0 right-0 bg-judicial-orange text-white text-xs rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 border-white">
                {userData.level}
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="text-2xl md:text-3xl font-serif text-white">{userData.name}</h1>
                <div className="flex justify-center md:justify-start gap-2">
                  <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                    {userData.preferredLanguage}
                  </span>
                  <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                    Joined {userData.joinedDate}
                  </span>
                </div>
              </div>
              <p className="text-white/70 mt-1">{userData.email}</p>
              
              {/* XP Progress */}
              <div className="mt-4 max-w-md">
                <div className="flex justify-between text-sm mb-1">
                  <span>Level {userData.level}</span>
                  <span>{userData.xp}/{userData.xpToNextLevel} XP to Level {userData.level + 1}</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full">
                  <div 
                    className="h-2 bg-judicial-orange rounded-full" 
                    style={{ width: `${(userData.xp / userData.xpToNextLevel) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-4 text-sm">
                  <div>
                    <span className="block font-bold text-xl">{userData.completedLessons}</span>
                    <span className="text-white/70">Lessons</span>
                  </div>
                  <div>
                    <span className="block font-bold text-xl">{userData.quizzesTaken}</span>
                    <span className="text-white/70">Quizzes</span>
                  </div>
                  <div>
                    <span className="block font-bold text-xl">{userData.badges.filter(b => b.earned).length}</span>
                    <span className="text-white/70">Badges</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Button */}
            <div className="hidden md:block">
              <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors p-2 rounded-full">
                <Settings size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Tabs */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab("progress")}
              className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                activeTab === "progress" 
                  ? "border-judicial-blue text-judicial-blue" 
                  : "border-transparent text-judicial-gray hover:text-judicial-blue"
              }`}
            >
              Learning Progress
            </button>
            <button
              onClick={() => setActiveTab("badges")}
              className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                activeTab === "badges" 
                  ? "border-judicial-blue text-judicial-blue" 
                  : "border-transparent text-judicial-gray hover:text-judicial-blue"
              }`}
            >
              Badges & Achievements
            </button>
            <button
              onClick={() => setActiveTab("recommendations")}
              className={`px-4 py-4 font-medium border-b-2 transition-colors ${
                activeTab === "recommendations" 
                  ? "border-judicial-blue text-judicial-blue" 
                  : "border-transparent text-judicial-gray hover:text-judicial-blue"
              }`}
            >
              Recommended Learning
            </button>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          {/* Learning Progress Tab */}
          {activeTab === "progress" && (
            <div className="space-y-10">
              {/* Recent Activity */}
              <div>
                <h2 className="section-title">Recent Activity</h2>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="divide-y">
                    {userData.recentActivity.map((activity) => (
                      <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex space-x-3">
                            <div className="mt-1">
                              {activity.type === 'video' && <BookOpen size={18} className="text-judicial-blue" />}
                              {activity.type === 'badge' && <Award size={18} className="text-judicial-orange" />}
                              {activity.type === 'quiz' && <Star size={18} className="text-green-600" />}
                              {activity.type === 'natak' && <BookOpen size={18} className="text-purple-600" />}
                            </div>
                            <div>
                              <p className="font-medium text-judicial-blue">{activity.title}</p>
                              <p className="text-sm text-judicial-gray flex items-center mt-1">
                                <Clock size={12} className="mr-1" /> 
                                {activity.timestamp}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-judicial-orange font-medium">
                            +{activity.xp} XP
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 p-4 text-center">
                    <button className="text-judicial-blue hover:text-judicial-orange transition-colors text-sm font-medium flex items-center justify-center mx-auto">
                      View All Activity <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Learning Statistics */}
              <div>
                <h2 className="section-title">Learning Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Topic Distribution */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-serif text-judicial-blue mb-4 flex items-center">
                      <BarChart3 size={18} className="mr-2" /> Topic Distribution
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-judicial-gray">Consumer Rights</span>
                          <span className="text-judicial-blue font-medium">45%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className="h-2 bg-judicial-orange rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-judicial-gray">Property Law</span>
                          <span className="text-judicial-blue font-medium">30%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className="h-2 bg-judicial-orange rounded-full" style={{ width: "30%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-judicial-gray">Constitutional Rights</span>
                          <span className="text-judicial-blue font-medium">15%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className="h-2 bg-judicial-orange rounded-full" style={{ width: "15%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-judicial-gray">Criminal Procedure</span>
                          <span className="text-judicial-blue font-medium">10%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className="h-2 bg-judicial-orange rounded-full" style={{ width: "10%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Learning Format */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-serif text-judicial-blue mb-4 flex items-center">
                      <BookOpen size={18} className="mr-2" /> Learning Format
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-judicial-gray">Videos</span>
                          <span className="text-judicial-blue font-medium">40%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className="h-2 bg-blue-500 rounded-full" style={{ width: "40%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-judicial-gray">Quizzes</span>
                          <span className="text-judicial-blue font-medium">25%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: "25%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-judicial-gray">Legal Plays</span>
                          <span className="text-judicial-blue font-medium">20%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className="h-2 bg-purple-500 rounded-full" style={{ width: "20%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-judicial-gray">Articles</span>
                          <span className="text-judicial-blue font-medium">15%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className="h-2 bg-yellow-500 rounded-full" style={{ width: "15%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Badges Tab */}
          {activeTab === "badges" && (
            <div>
              <h2 className="section-title">Badges & Achievements</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {userData.badges.map((badge) => (
                  <div 
                    key={badge.id} 
                    className={`p-6 rounded-lg shadow-sm flex flex-col items-center text-center ${
                      badge.earned ? "bg-white" : "bg-gray-100 opacity-70"
                    }`}
                  >
                    <div className={`text-4xl mb-4 ${!badge.earned && "grayscale"}`}>
                      {badge.icon}
                    </div>
                    <h3 className="text-lg font-serif text-judicial-blue mb-2">{badge.name}</h3>
                    <p className="text-sm text-judicial-gray mb-4">{badge.description}</p>
                    <div className={`text-xs px-3 py-1 rounded-full ${
                      badge.earned 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-200 text-gray-600"
                    }`}>
                      {badge.earned ? "Earned" : "Locked"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === "recommendations" && (
            <div>
              <h2 className="section-title">Recommended for You</h2>
              <p className="text-judicial-gray mb-8 max-w-3xl">
                Based on your learning history and interests, we've curated these resources to help you continue your legal education journey.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userData.recommendations.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-judicial-blue">{item.title}</h3>
                      </div>
                      <p className="text-judicial-gray text-sm mt-2">{item.description}</p>
                      <div className="mt-4">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-judicial-gray">
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                      </div>
                      <button className="mt-4 w-full btn-primary text-sm">Start Learning</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
