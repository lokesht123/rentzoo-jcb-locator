
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-50 to-gray-100 text-gray-800 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-3">
              <img 
                src="/lovable-uploads/ff4c2e1a-30c0-403e-b9a3-e50f07e36b24.png" 
                alt="RentZoo Logo" 
                className="h-8 w-auto" 
              />
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Your trusted partner for premium JCB rentals.
            </p>
            <div className="flex space-x-3">
              <Facebook className="h-4 w-4 text-gray-500 hover:text-blue-500 cursor-pointer transition-all duration-200 hover:scale-110" />
              <Twitter className="h-4 w-4 text-gray-500 hover:text-blue-400 cursor-pointer transition-all duration-200 hover:scale-110" />
              <Instagram className="h-4 w-4 text-gray-500 hover:text-pink-500 cursor-pointer transition-all duration-200 hover:scale-110" />
              <Linkedin className="h-4 w-4 text-gray-500 hover:text-blue-600 cursor-pointer transition-all duration-200 hover:scale-110" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-800">Quick Links</h3>
            <ul className="space-y-1">
              <li><Link to="/" className="text-gray-600 hover:text-yellow-600 transition-colors text-sm">Home</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-yellow-600 transition-colors text-sm">Services</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-yellow-600 transition-colors text-sm">About</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-yellow-600 transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-800">Services</h3>
            <ul className="space-y-1">
              <li><Link to="/services" className="text-gray-600 hover:text-yellow-600 transition-colors text-sm">JCB Rental</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-yellow-600 transition-colors text-sm">Equipment Hire</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-yellow-600 transition-colors text-sm">Site Support</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-800">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-yellow-600" />
                <span className="text-gray-600 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-yellow-600" />
                <span className="text-gray-600 text-sm">info@rentzoo.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-gray-500 text-xs">
              © 2024 RentZoo. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link to="/privacy" className="text-gray-500 hover:text-gray-700 text-xs transition-colors">Privacy</Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-700 text-xs transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
