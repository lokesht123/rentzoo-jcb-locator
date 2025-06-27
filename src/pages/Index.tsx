
import { MapPin, Search, Clock, Shield, Star, Phone } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import JCBCard from "@/components/JCBCard";
import MapView from "@/components/MapView";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Index = () => {
  const [location, setLocation] = useState("");
  const [showMap, setShowMap] = useState(false);

  const jcbTypes = [
    {
      id: 1,
      name: "JCB 3DX Super",
      image: "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=500&h=300&fit=crop",
      hourlyRate: 1500,
      features: ["Excavation", "Loading", "Lifting"],
      available: true,
      distance: "0.5 km away"
    },
    {
      id: 2,
      name: "JCB 3CX Eco",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop",
      hourlyRate: 1200,
      features: ["Digging", "Loading", "Grading"],
      available: true,
      distance: "1.2 km away"
    },
    {
      id: 3,
      name: "JCB JS220",
      image: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=500&h=300&fit=crop",
      hourlyRate: 1800,
      features: ["Heavy Excavation", "Demolition"],
      available: false,
      distance: "2.1 km away"
    }
  ];

  const handleSearch = () => {
    if (location.trim()) {
      setShowMap(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-blue-600/10 backdrop-blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent mb-6">
              RentZoo
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-4">
              Premium JCB Rentals at Your Fingertips
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Book construction equipment instantly. Pay by the hour. Professional service guaranteed.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 h-5 w-5" />
                  <Input
                    placeholder="Enter your work location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-12 h-12 text-lg border-gray-200"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="h-12 px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find JCBs
                </Button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center group">
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Hourly Billing</h3>
                <p className="text-gray-600">Pay only for the hours you use. No hidden charges.</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Insured Equipment</h3>
                <p className="text-gray-600">All equipment is fully insured and maintained.</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Expert Operators</h3>
                <p className="text-gray-600">Skilled operators available on request.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {showMap && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Available JCBs Near <span className="text-orange-600">{location}</span>
            </h2>
            <div className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/20">
              <MapView />
            </div>
          </div>
        </section>
      )}

      {/* Available JCBs Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Available Equipment</h2>
          <p className="text-xl text-gray-600 text-center mb-12">Choose from our premium fleet</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jcbTypes.map((jcb) => (
              <JCBCard key={jcb.id} jcb={jcb} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500/10 to-blue-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-gray-700">Happy Customers</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-700">JCBs Available</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-700">Service Support</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-700">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-orange-500 to-blue-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">Join thousands of contractors who trust RentZoo</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                  Join Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                <Phone className="mr-2 h-5 w-5" />
                Call Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
