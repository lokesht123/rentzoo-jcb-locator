
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

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl">
      <div className="max-w-7xl mx-auto px-[5px]">
        <div className="flex justify-between items-center h-14 px-[20px] py-0">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src="/lovable-uploads/ff4c2e1a-30c0-403e-b9a3-e50f07e36b24.png" 
                alt="RentZoo Logo" 
                className="h-10 w-auto group-hover:scale-105 transition-transform duration-300" 
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

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden absolute right-4 top-full mt-0 bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl py-4 w-fit min-w-[120px]">
            <div className="flex flex-col space-y-4 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`font-medium transition-colors hover:text-yellow-600 ${
                    isActive(item.path) ? "text-yellow-600" : "text-gray-700"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
