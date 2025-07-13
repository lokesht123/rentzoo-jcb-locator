
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-3">
              <img 
                src="/lovable-uploads/ff4c2e1a-30c0-403e-b9a3-e50f07e36b24.png" 
                alt="RentZoo Logo" 
                className="h-8 w-auto" 
              />
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Your trusted partner for premium JCB rentals.
            </p>
            <div className="flex space-x-3">
              <Facebook className="h-4 w-4 text-gray-400 hover:text-blue-400 cursor-pointer transition-all duration-200 hover:scale-110" />
              <Twitter className="h-4 w-4 text-gray-400 hover:text-blue-300 cursor-pointer transition-all duration-200 hover:scale-110" />
              <Instagram className="h-4 w-4 text-gray-400 hover:text-pink-400 cursor-pointer transition-all duration-200 hover:scale-110" />
              <Linkedin className="h-4 w-4 text-gray-400 hover:text-blue-500 cursor-pointer transition-all duration-200 hover:scale-110" />
            </div>
          </div>

          {/* Quick Links & Services - Side by side on mobile */}
          <div className="md:col-span-1 lg:col-span-2 grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-white">Quick Links</h3>
              <ul className="space-y-1">
                <li><Link to="/" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Home</Link></li>
                <li><Link to="/services" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Services</Link></li>
                <li><Link to="/about" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">About</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-3 text-white">Services</h3>
              <ul className="space-y-1">
                <li><Link to="/services" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">JCB Rental</Link></li>
                <li><Link to="/services" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Equipment Hire</Link></li>
                <li><Link to="/services" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Site Support</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-white">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-300 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-300 text-sm">info@rentzoo.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-6 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-gray-400 text-xs">
              © 2024 RentZoo. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link to="/privacy" className="text-gray-400 hover:text-gray-200 text-xs transition-colors">Privacy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-gray-200 text-xs transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
