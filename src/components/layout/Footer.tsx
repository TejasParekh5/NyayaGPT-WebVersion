
import { Link } from "react-router-dom";
import { 
  GavelIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube 
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-judicial-blue text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <GavelIcon size={20} className="text-judicial-blue" />
              </div>
              <span className="font-serif text-2xl">NyaySetu</span>
            </div>
            <p className="text-sm mb-4 text-gray-300">
              An AI-powered, multilingual legal literacy platform empowering Indian citizens to understand their rights through accessible assistance.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-white hover:text-judicial-orange transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-judicial-orange transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-judicial-orange transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-judicial-orange transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-judicial-orange transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/chatbot" className="text-gray-300 hover:text-judicial-orange transition-colors">Legal Chatbot</Link>
              </li>
              <li>
                <Link to="/learn" className="text-gray-300 hover:text-judicial-orange transition-colors">Legal Learning</Link>
              </li>
              <li>
                <Link to="/legal-aid" className="text-gray-300 hover:text-judicial-orange transition-colors">Find Legal Aid</Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-gray-300 hover:text-judicial-orange transition-colors">Accessibility</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="shrink-0 mt-0.5" />
                <span className="text-gray-300">123 Justice Ave, New Delhi, India 110001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="shrink-0" />
                <span className="text-gray-300">+91 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="shrink-0" />
                <span className="text-gray-300">contact@nyaysetu.org</span>
              </li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-gray-300 mb-3">
              Subscribe to our newsletter for the latest legal updates and resources.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-md text-black focus:outline-none"
              />
              <button className="bg-judicial-orange hover:bg-opacity-90 text-white font-medium px-4 py-2 rounded-md transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <blockquote className="italic mb-4 text-lg font-serif">"Justice delayed is justice denied."</blockquote>
          <div className="flex flex-wrap justify-center space-x-4 mb-4">
            <Link to="/terms" className="hover:text-judicial-orange transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-judicial-orange transition-colors">Privacy Policy</Link>
            <a href="https://nalsa.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-judicial-orange transition-colors">NALSA</a>
          </div>
          <p>&copy; {new Date().getFullYear()} NyaySetu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
