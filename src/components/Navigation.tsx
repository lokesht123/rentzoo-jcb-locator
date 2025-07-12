
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

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
        <div className="flex justify-between items-center h-16 px-[20px] py-0">
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

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard">
                  <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 bg-white/50 backdrop-blur-sm">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={signOut}
                  variant="ghost"
                  className="text-gray-600 hover:text-yellow-600 hover:bg-white/50"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-yellow-500 to-cyan-500 hover:from-yellow-600 hover:to-cyan-600 text-white shadow-lg">
                  <Phone className="mr-2 h-4 w-4" />
                  Join RentZoo
                </Button>
              </Link>
            )}
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
          <div className="lg:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-4">
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
              {user ? (
                <div className="flex flex-col space-y-2">
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    variant="ghost"
                    className="text-gray-600 hover:text-yellow-600 w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button className="bg-gradient-to-r from-yellow-500 to-cyan-500 hover:from-yellow-600 hover:to-cyan-600 w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Join RentZoo
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
