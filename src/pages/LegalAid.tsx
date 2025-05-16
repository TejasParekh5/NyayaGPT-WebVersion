
import { useState } from "react";
import Layout from "../components/layout/Layout";
import { Search, MapPin, Phone, Mail, ExternalLink, MessageSquare, Filter, ChevronDown } from "lucide-react";

interface LegalAidProvider {
  id: string;
  name: string;
  type: "government" | "ngo" | "lawyer";
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  languages: string[];
  specializations: string[];
  image?: string;
  rating?: number;
  distance?: string;
}

const LegalAid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for legal aid providers
  const legalAidProviders: LegalAidProvider[] = [
    {
      id: "1",
      name: "Delhi State Legal Services Authority (DLSA)",
      type: "government",
      description: "Government body that provides free legal services to eligible citizens as per the Legal Services Authorities Act.",
      address: "Central Office, Patiala House Courts Complex, New Delhi - 110001",
      phone: "+91-11-23384781",
      email: "dlsa-delhi@nic.in",
      website: "https://dslsa.org",
      languages: ["English", "Hindi", "Punjabi"],
      specializations: ["All Legal Matters", "Legal Aid", "Lok Adalats"],
      image: "https://placehold.co/300x200/1A237E/FFFFFF.png?text=DLSA",
      rating: 4.5,
      distance: "3.2 km"
    },
    {
      id: "2",
      name: "NALSAR Legal Aid Society",
      type: "ngo",
      description: "NGO providing free legal assistance to underprivileged groups and conducting legal literacy camps.",
      address: "Justice City, Shameerpet, Medchal District, Hyderabad, Telangana - 500101",
      phone: "+91-40-23498385",
      email: "legalaidsociety@nalsar.ac.in",
      website: "https://www.nalsar.ac.in",
      languages: ["English", "Telugu", "Hindi", "Urdu"],
      specializations: ["Women's Rights", "Tribal Rights", "Labor Law", "Environmental Law"],
      image: "https://placehold.co/300x200/FF9800/FFFFFF.png?text=NALSAR",
      rating: 4.7,
      distance: "12.5 km"
    },
    {
      id: "3",
      name: "Adv. Anjali Sharma",
      type: "lawyer",
      description: "Pro bono lawyer specializing in women's rights and domestic violence cases with 15+ years of experience.",
      address: "Chamber No. 542, Saket District Court, New Delhi - 110017",
      phone: "+91-98765-43210",
      email: "advocate.anjali@gmail.com",
      languages: ["English", "Hindi", "Bengali"],
      specializations: ["Women's Rights", "Domestic Violence", "Family Law"],
      image: "https://placehold.co/300x200/4CAF50/FFFFFF.png?text=Advocate",
      rating: 4.8,
      distance: "5.7 km"
    },
    {
      id: "4",
      name: "Karnataka State Legal Services Authority",
      type: "government",
      description: "State legal services authority providing free legal aid to eligible citizens in Karnataka.",
      address: "Nyaya Degula, 1st Floor, H. Siddaiah Road, Bangalore - 560027",
      phone: "+91-80-22111714",
      email: "karslsa@gmail.com",
      website: "https://kslsa.kar.nic.in",
      languages: ["English", "Kannada", "Hindi"],
      specializations: ["All Legal Matters", "ADR", "Legal Literacy"],
      image: "https://placehold.co/300x200/1A237E/FFFFFF.png?text=KSLSA",
      rating: 4.3,
      distance: "8.1 km"
    },
    {
      id: "5",
      name: "Centre for Social Justice",
      type: "ngo",
      description: "NGO focused on providing legal aid to marginalized communities and fighting for social justice.",
      address: "4th Floor, MANU Bhavan, 7 Atmajyoti Ashram Road, Ellis Bridge, Ahmedabad - 380006",
      phone: "+91-79-26582298",
      email: "contact@centreforsocialjustice.net",
      website: "https://www.centreforsocialjustice.net",
      languages: ["English", "Gujarati", "Hindi", "Marathi"],
      specializations: ["Dalit Rights", "Tribal Rights", "RTI", "Public Interest Litigation"],
      image: "https://placehold.co/300x200/FF9800/FFFFFF.png?text=CSJ",
      rating: 4.6,
      distance: "15.2 km"
    },
    {
      id: "6",
      name: "Adv. Rajesh Kumar",
      type: "lawyer",
      description: "Senior advocate providing pro bono services for labor law and employment cases.",
      address: "A-14, Connaught Place, New Delhi - 110001",
      phone: "+91-95555-12345",
      email: "adv.rajeshkumar@legalaid.org",
      languages: ["English", "Hindi", "Bhojpuri"],
      specializations: ["Labor Law", "Employment", "Industrial Disputes"],
      image: "https://placehold.co/300x200/4CAF50/FFFFFF.png?text=Labor+Lawyer",
      rating: 4.4,
      distance: "4.8 km"
    },
  ];

  const states = [
    { value: "all", label: "All States" },
    { value: "delhi", label: "Delhi" },
    { value: "telangana", label: "Telangana" },
    { value: "karnataka", label: "Karnataka" },
    { value: "gujarat", label: "Gujarat" },
    { value: "maharashtra", label: "Maharashtra" },
  ];

  const providerTypes = [
    { value: "all", label: "All Types" },
    { value: "government", label: "Government Organizations" },
    { value: "ngo", label: "NGOs & Non-Profits" },
    { value: "lawyer", label: "Pro Bono Lawyers" },
  ];

  const languages = [
    { value: "all", label: "All Languages" },
    { value: "english", label: "English" },
    { value: "hindi", label: "Hindi" },
    { value: "kannada", label: "Kannada" },
    { value: "telugu", label: "Telugu" },
    { value: "gujarati", label: "Gujarati" },
    { value: "marathi", label: "Marathi" },
    { value: "bengali", label: "Bengali" },
    { value: "punjabi", label: "Punjabi" },
    { value: "urdu", label: "Urdu" },
  ];

  // Filter providers based on search and filters
  const filteredProviders = legalAidProviders.filter((provider) => {
    const matchesSearch = 
      searchTerm === "" ||
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.specializations.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === "all" || provider.type === selectedType;
    
    const matchesLanguage = 
      selectedLanguage === "all" || 
      provider.languages.some(lang => lang.toLowerCase() === selectedLanguage.toLowerCase());
    
    // Note: In a real app, we'd filter by state based on provider's address
    // Here we're simplifying for the mock data
    const matchesState = selectedState === "all" || true;
    
    return matchesSearch && matchesType && matchesLanguage && matchesState;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-judicial-blue to-blue-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Legal Aid Access
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Connect with legal aid providers, pro bono lawyers, and organizations that can help you understand and assert your rights.
          </p>
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for legal aid providers, specializations, or topics..."
              className="w-full px-4 py-3 pr-10 rounded-md border-none text-judicial-gray focus:outline-none focus:ring-2 focus:ring-judicial-orange shadow-md"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-judicial-gray" size={20} />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white py-4 border-b sticky top-16 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-judicial-gray hover:text-judicial-blue transition-colors"
              >
                <Filter size={18} />
                <span>Filters</span>
                <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-judicial-gray">
              <span>Showing {filteredProviders.length} results</span>
            </div>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 mt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-judicial-gray mb-1">State/Region</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-judicial-blue"
                >
                  {states.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-judicial-gray mb-1">Provider Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-judicial-blue"
                >
                  {providerTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-judicial-gray mb-1">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-judicial-blue"
                >
                  {languages.map((language) => (
                    <option key={language.value} value={language.value}>
                      {language.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Legal Aid Providers */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          {filteredProviders.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProviders.map((provider) => (
                <div key={provider.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {provider.image && (
                      <div className="md:w-1/3">
                        <img src={provider.image} alt={provider.name} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className={`p-6 flex-1 ${provider.image ? "md:w-2/3" : "w-full"}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-serif text-judicial-blue">{provider.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              provider.type === 'government' ? 'bg-blue-100 text-blue-700' : 
                              provider.type === 'ngo' ? 'bg-orange-100 text-orange-700' : 
                              'bg-green-100 text-green-700'
                            }`}>
                              {provider.type === 'government' ? 'Government' : 
                              provider.type === 'ngo' ? 'NGO' : 'Pro Bono Lawyer'}
                            </span>
                            {provider.distance && (
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-judicial-gray">
                                {provider.distance}
                              </span>
                            )}
                          </div>
                        </div>
                        {provider.rating && (
                          <div className="flex items-center bg-judicial-blue/5 px-2 py-1 rounded">
                            <span className="text-judicial-blue font-semibold">{provider.rating}</span>
                            <span className="text-yellow-500 ml-1">★</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-judicial-gray mt-3">{provider.description}</p>
                      
                      <h4 className="font-medium text-judicial-blue mt-4">Specializations:</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {provider.specializations.map((spec, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-judicial-gray">
                            {spec}
                          </span>
                        ))}
                      </div>
                      
                      <h4 className="font-medium text-judicial-blue mt-3">Languages:</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {provider.languages.map((lang, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-judicial-gray">
                            {lang}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-judicial-gray">
                        <div className="flex items-start space-x-2">
                          <MapPin size={16} className="shrink-0 mt-0.5" />
                          <span>{provider.address}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Phone size={16} className="shrink-0" />
                          <a href={`tel:${provider.phone}`} className="hover:text-judicial-blue transition-colors">
                            {provider.phone}
                          </a>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Mail size={16} className="shrink-0" />
                          <a href={`mailto:${provider.email}`} className="hover:text-judicial-blue transition-colors">
                            {provider.email}
                          </a>
                        </div>
                        {provider.website && (
                          <div className="flex items-center space-x-2 mt-2">
                            <ExternalLink size={16} className="shrink-0" />
                            <a href={provider.website} target="_blank" rel="noopener noreferrer" className="hover:text-judicial-blue transition-colors">
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mt-6">
                        <button className="flex items-center space-x-2 bg-judicial-orange hover:bg-opacity-90 text-white font-medium px-4 py-2 rounded-md transition-all">
                          <Phone size={16} />
                          <span>Contact</span>
                        </button>
                        <button className="flex items-center space-x-2 bg-judicial-blue hover:bg-opacity-90 text-white font-medium px-4 py-2 rounded-md transition-all">
                          <MessageSquare size={16} />
                          <span>Chat</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-serif text-judicial-blue mb-2">No legal aid providers found</h3>
              <p className="text-judicial-gray">
                Try adjusting your search or filters to find legal assistance.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Information Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">Understanding Legal Aid</h2>
              <div className="space-y-4 text-judicial-gray">
                <p>
                  Legal aid in India is a service provided to ensure that vulnerable groups have access to justice. The Legal Services Authorities Act, 1987, guarantees free legal services to specific categories of people.
                </p>
                <h3 className="text-xl font-serif text-judicial-blue mt-6">Who is eligible for free legal aid?</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Women and children</li>
                  <li>Members of Scheduled Castes and Scheduled Tribes</li>
                  <li>Victims of human trafficking</li>
                  <li>Persons with disabilities</li>
                  <li>Victims of mass disaster, ethnic violence, caste atrocity, flood, drought, earthquake, or industrial disaster</li>
                  <li>Industrial workmen</li>
                  <li>Persons in custody</li>
                  <li>Persons whose annual income is below the specified limit (varies by state)</li>
                </ul>
                <p className="mt-4">
                  If you qualify for legal aid, you can receive assistance in the form of legal representation, advice, document preparation, and more.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-serif text-judicial-blue mb-4">How to Apply for Legal Aid</h3>
              <ol className="space-y-4">
                <li className="flex">
                  <div className="mr-4 w-8 h-8 bg-judicial-blue rounded-full flex items-center justify-center text-white font-semibold">1</div>
                  <div>
                    <h4 className="font-medium text-judicial-blue">Locate your nearest Legal Services Authority</h4>
                    <p className="text-sm text-judicial-gray mt-1">Use our search tool above to find the nearest State Legal Services Authority (SLSA), District Legal Services Authority (DLSA), or Taluk Legal Services Committee (TLSC).</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 w-8 h-8 bg-judicial-blue rounded-full flex items-center justify-center text-white font-semibold">2</div>
                  <div>
                    <h4 className="font-medium text-judicial-blue">Submit an application</h4>
                    <p className="text-sm text-judicial-gray mt-1">Fill out the legal aid application form, which can be obtained in person or downloaded from their website.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 w-8 h-8 bg-judicial-blue rounded-full flex items-center justify-center text-white font-semibold">3</div>
                  <div>
                    <h4 className="font-medium text-judicial-blue">Provide supporting documents</h4>
                    <p className="text-sm text-judicial-gray mt-1">Include proof of income, identity proof, and any documents related to your legal matter.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 w-8 h-8 bg-judicial-blue rounded-full flex items-center justify-center text-white font-semibold">4</div>
                  <div>
                    <h4 className="font-medium text-judicial-blue">Evaluation and assignment</h4>
                    <p className="text-sm text-judicial-gray mt-1">Your application will be evaluated, and if approved, a legal aid lawyer will be assigned to your case.</p>
                  </div>
                </li>
              </ol>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="w-full btn-primary">
                  Download Legal Aid Application Form
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NALSA Contact */}
      <section className="py-16 bg-judicial-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
              National Legal Services Authority (NALSA)
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              NALSA was constituted under the Legal Services Authorities Act, 1987 to provide free legal services to the eligible candidates and organize Lok Adalats for amicable settlement of disputes.
            </p>
            <div className="flex justify-center space-x-6">
              <div className="text-center">
                <Phone size={24} className="mx-auto mb-2" />
                <p className="text-sm text-gray-200">Toll-Free Number</p>
                <p className="font-semibold">1516</p>
              </div>
              <div className="text-center">
                <Mail size={24} className="mx-auto mb-2" />
                <p className="text-sm text-gray-200">Email</p>
                <p className="font-semibold">nalsa-dla@nic.in</p>
              </div>
              <div className="text-center">
                <ExternalLink size={24} className="mx-auto mb-2" />
                <p className="text-sm text-gray-200">Website</p>
                <p className="font-semibold">nalsa.gov.in</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LegalAid;
