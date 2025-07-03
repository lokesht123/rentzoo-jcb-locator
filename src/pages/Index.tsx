
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
  
  const jcbTypes = [{
    id: 1,
    name: "JCB 3DX Super",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&h=300&fit=crop",
    hourlyRate: 1500,
    features: ["Excavation", "Loading", "Lifting"],
    available: true,
    distance: "0.5 km away"
  }, {
    id: 2,
    name: "JCB 3CX Eco",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&h=300&fit=crop",
    hourlyRate: 1200,
    features: ["Digging", "Loading", "Grading"],
    available: true,
    distance: "1.2 km away"
  }, {
    id: 3,
    name: "JCB JS220",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
    hourlyRate: 1800,
    features: ["Heavy Excavation", "Demolition"],
    available: false,
    distance: "2.1 km away"
  }];

  const handleSearch = () => {
    console.log("Searching for location:", location);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-cyan-50 to-yellow-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-cyan-600/10 backdrop-blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/lovable-uploads/ff4c2e1a-30c0-403e-b9a3-e50f07e36b24.png" 
                alt="RentZoo Logo" 
                className="h-20 w-auto animate-scale-in"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Premium JCB Rentals at Your Fingertips
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-3">
              Book construction equipment instantly. Pay by the hour. Professional service guaranteed.
            </p>
            
            {/* Login/Signup Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-cyan-500 hover:from-yellow-600 hover:to-cyan-600 text-white font-semibold px-8 shadow-xl">
                  Sign In / Sign Up
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                <Phone className="mr-2 h-5 w-5" />
                Call Support
              </Button>
            </div>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/30">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500 h-5 w-5" />
                  <Input 
                    placeholder="Enter your work location..." 
                    value={location} 
                    onChange={e => setLocation(e.target.value)} 
                    className="pl-12 h-12 text-lg border-gray-200 bg-white/70" 
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  className="h-12 px-8 bg-gradient-to-r from-yellow-500 to-cyan-500 hover:from-yellow-600 hover:to-cyan-600 text-white font-semibold shadow-lg"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find JCBs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-600 to-cyan-600 bg-clip-text text-transparent">
            Available JCBs Near You
          </h2>
          <div className="bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/30">
            <MapView />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <Clock className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Hourly Billing</h3>
                <p className="text-gray-600">Pay only for the hours you use. No hidden charges.</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <Shield className="h-10 w-10 text-cyan-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Insured Equipment</h3>
                <p className="text-gray-600">All equipment is fully insured and maintained.</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                <Star className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Expert Operators</h3>
                <p className="text-gray-600">Skilled operators available on request.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available JCBs Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-600 to-cyan-600 bg-clip-text text-transparent">Available Equipment</h2>
          <p className="text-lg text-gray-600 text-center mb-8">Choose from our premium fleet</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jcbTypes.map(jcb => <JCBCard key={jcb.id} jcb={jcb} />)}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-yellow-500/10 to-cyan-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-yellow-600 mb-2">500+</div>
              <div className="text-gray-700">Happy Customers</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-cyan-600 mb-2">50+</div>
              <div className="text-gray-700">JCBs Available</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-yellow-600 mb-2">24/7</div>
              <div className="text-gray-700">Service Support</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-cyan-600 mb-2">15+</div>
              <div className="text-gray-700">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-yellow-500 to-cyan-600 rounded-3xl p-8 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-6 opacity-90">Join thousands of contractors who trust RentZoo</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="bg-white text-yellow-600 hover:bg-gray-100 shadow-lg">
                  Join Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white hover:bg-white text-yellow-600">
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
