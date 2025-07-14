
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Reviews", path: "/reviews" },
    { name: "Tracking", path: "/tracking" },
    { name: "Pricing", path: "/pricing" },
    { name: "Support", path: "/support" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const isActive = (path: string) => location.pathname === path;

  // Calculate dropdown width based on longest page name
  const longestPageName = navItems.reduce((longest, item) => 
    item.name.length > longest.length ? item.name : longest, ""
  );
  const dropdownWidth = Math.max(longestPageName.length * 8 + 32, 120); // 8px per char + padding

  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl transition-all duration-300 ease-out">
        <div className="max-w-7xl mx-auto px-[5px]">
          <div className="flex justify-between items-center h-14 px-[20px] py-0">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src="/lovable-uploads/ff4c2e1a-30c0-403e-b9a3-e50f07e36b24.png" 
                  alt="RentZoo Logo" 
                  className="h-9 w-auto group-hover:scale-105 transition-transform duration-300" 
                  loading="eager"
                  decoding="sync"
                  style={{ imageRendering: 'crisp-edges' }}
                /> 
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`font-medium transition-all duration-300 hover:text-yellow-500 hover:scale-105 ${
                      isActive(item.path) ? "text-yellow-500 font-semibold" : "text-gray-700"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button className="bg-gradient-to-r from-yellow-500 to-cyan-500 hover:from-yellow-600 hover:to-cyan-600 text-white">
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-yellow-600 transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation - Dropdown attached to navbar */}
          <div 
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${
              isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="border-t border-white/20">
              <div className="py-3 px-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-3 py-2 rounded-lg font-medium transition-all duration-200 text-center ${
                      isActive(item.path) 
                        ? "text-yellow-600 bg-yellow-50/50" 
                        : "text-gray-700 hover:text-yellow-600 hover:bg-gray-50/30"
                    }`}
                    style={{ width: `${dropdownWidth}px`, margin: '0 auto' }}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-2 border-t border-white/20 mt-3">
                  <Button className="w-full bg-gradient-to-r from-yellow-500 to-cyan-500 text-white">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
