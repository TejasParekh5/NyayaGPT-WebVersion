import Layout from "../components/layout/Layout";
import { Scale, FileTextIcon, GavelIcon, Book } from "lucide-react";

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-judicial-blue to-blue-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
            About <span className="text-judicial-orange">NyaySetu</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Bridging the gap between citizens and legal knowledge through accessible, multilingual AI assistance.
          </p>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">The Legal Literacy Challenge</h2>
              <div className="space-y-4 text-judicial-gray">
                <p>
                  In India, access to legal knowledge is severely limited by language barriers, complex legal jargon, and a scarcity of affordable legal services. This creates a significant justice gap that affects millions of citizens.
                </p>
                <p>
                  With 22 officially recognized languages and over 1,600 dialects, many Indians cannot access legal information in their native language, making it nearly impossible for them to understand their fundamental rights and protections.
                </p>
                <p>
                  This legal literacy gap disproportionately affects vulnerable populations, including rural communities, women, and economically disadvantaged citizens who lack the resources to hire legal representation.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-3xl font-serif text-judicial-blue mb-2">70%</h3>
                <p className="text-judicial-gray">Indians lack adequate access to legal services</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-3xl font-serif text-judicial-blue mb-2">41M+</h3>
                <p className="text-judicial-gray">Cases pending in Indian courts</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-3xl font-serif text-judicial-blue mb-2">22+</h3>
                <p className="text-judicial-gray">Official languages requiring legal translation</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-3xl font-serif text-judicial-blue mb-2">11K+</h3>
                <p className="text-judicial-gray">Laws and regulations to navigate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto">
          <h2 className="section-title text-center mx-auto after:left-1/2 after:-translate-x-1/2">
            Our Solution
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-t-4 border-judicial-blue">
              <div className="w-14 h-14 bg-judicial-blue/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FileTextIcon size={24} className="text-judicial-blue" />
              </div>
              <h3 className="text-xl font-serif text-judicial-blue mb-3 text-center">AI-Powered Technology</h3>
              <p className="text-judicial-gray text-center">
                Using cutting-edge AI to understand legal queries in multiple languages and provide accurate, contextual responses tailored to Indian law.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-t-4 border-judicial-orange">
              <div className="w-14 h-14 bg-judicial-orange/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <GavelIcon size={24} className="text-judicial-orange" />
              </div>
              <h3 className="text-xl font-serif text-judicial-blue mb-3 text-center">Multilingual Access</h3>
              <p className="text-judicial-gray text-center">
                Breaking language barriers by offering legal information in 22+ Indian languages, with voice input and output for increased accessibility.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-t-4 border-judicial-blue">
              <div className="w-14 h-14 bg-judicial-blue/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Book size={24} className="text-judicial-blue" />
              </div>
              <h3 className="text-xl font-serif text-judicial-blue mb-3 text-center">Legal Aid Network</h3>
              <p className="text-judicial-gray text-center">
                Connecting users with NALSA resources, legal aid NGOs, and pro-bono lawyers who can provide further assistance in their preferred language.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-judicial-blue text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-6">Our Vision</h2>
              <p className="text-xl leading-relaxed">
                To create a legally empowered India where every citizen, regardless of language or location, can understand and assert their legal rights.
              </p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-6">Our Mission</h2>
              <p className="text-xl leading-relaxed">
                To bridge the legal literacy gap through accessible, multilingual AI assistance that democratizes access to legal knowledge across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <h2 className="section-title text-center mx-auto after:left-1/2 after:-translate-x-1/2">
            Our Journey
          </h2>

          <div className="relative mt-16">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-judicial-blue/20"></div>
            
            {/* Timeline Items */}
            <div className="relative z-10">
              {/* Item 1 */}
              <div className="flex flex-col md:flex-row items-center mb-16">
                <div className="md:w-1/2 md:pr-12 md:text-right">
                  <h3 className="text-xl font-serif text-judicial-blue mb-2">Research & Development</h3>
                  <p className="text-judicial-gray">Extensive research on legal literacy gaps and language barriers in India's legal system</p>
                </div>
                <div className="mx-4 md:mx-0 my-4 md:my-0 w-8 h-8 rounded-full bg-judicial-blue flex items-center justify-center text-white relative z-10">
                  <span>1</span>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <p className="text-judicial-gray font-medium">2023</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex flex-col md:flex-row items-center mb-16">
                <div className="md:w-1/2 md:pr-12 md:text-right">
                  <p className="text-judicial-gray font-medium">2023</p>
                </div>
                <div className="mx-4 md:mx-0 my-4 md:my-0 w-8 h-8 rounded-full bg-judicial-blue flex items-center justify-center text-white relative z-10">
                  <span>2</span>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <h3 className="text-xl font-serif text-judicial-blue mb-2">AI Model Development</h3>
                  <p className="text-judicial-gray">Creation and training of specialized legal AI models for Indian legal contexts</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex flex-col md:flex-row items-center mb-16">
                <div className="md:w-1/2 md:pr-12 md:text-right">
                  <h3 className="text-xl font-serif text-judicial-blue mb-2">Multilingual Integration</h3>
                  <p className="text-judicial-gray">Implementation of Bhashini API for comprehensive language support across Indian languages</p>
                </div>
                <div className="mx-4 md:mx-0 my-4 md:my-0 w-8 h-8 rounded-full bg-judicial-blue flex items-center justify-center text-white relative z-10">
                  <span>3</span>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <p className="text-judicial-gray font-medium">2024</p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 md:text-right">
                  <p className="text-judicial-gray font-medium">2024</p>
                </div>
                <div className="mx-4 md:mx-0 my-4 md:my-0 w-8 h-8 rounded-full bg-judicial-orange flex items-center justify-center text-white relative z-10">
                  <span>4</span>
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <h3 className="text-xl font-serif text-judicial-blue mb-2">Platform Launch</h3>
                  <p className="text-judicial-gray">Official launch of NyaySetu to empower Indian citizens with legal knowledge</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
