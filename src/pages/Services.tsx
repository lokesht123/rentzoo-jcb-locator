
import { Clock, Shield, Users, Settings, Wrench, Headphones } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      icon: <Settings className="h-12 w-12" />,
      title: "JCB 3DX Super",
      description: "Perfect for excavation, loading, and general construction work",
      features: ["Excavation depth: 5.7m", "Loading capacity: 1.2m³", "Max reach: 7.2m"],
      hourlyRate: 1500
    },
    {
      icon: <Wrench className="h-12 w-12" />,
      title: "JCB 3CX Eco",
      description: "Fuel-efficient model ideal for medium construction projects",
      features: ["Eco-friendly engine", "Versatile operation", "Compact design"],
      hourlyRate: 1200
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Heavy Excavators",
      description: "Industrial-grade excavators for large construction projects",
      features: ["Heavy-duty performance", "Deep excavation", "Demolition work"],
      hourlyRate: 1800
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: "Skilled Operators",
      description: "Certified and experienced equipment operators",
      features: ["Certified professionals", "Safety trained", "Efficient operation"],
      hourlyRate: 500
    },
    {
      icon: <Headphones className="h-12 w-12" />,
      title: "24/7 Support",
      description: "Round-the-clock technical support and maintenance",
      features: ["Emergency response", "Technical assistance", "Maintenance support"],
      hourlyRate: 200
    },
    {
      icon: <Clock className="h-12 w-12" />,
      title: "Flexible Rental",
      description: "Hourly, daily, weekly, and monthly rental options",
      features: ["Flexible timing", "No hidden charges", "Transparent pricing"],
      hourlyRate: 0
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive JCB rental solutions with professional equipment and expert support
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {service.hourlyRate > 0 && (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-orange-600">₹{service.hourlyRate}</span>
                      <span className="text-gray-600">/hour</span>
                    </div>
                    <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                      Book Now
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500/10 to-blue-500/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose RentZoo?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
                <div className="text-4xl font-bold text-orange-600 mb-2">500+</div>
                <div className="text-gray-700">Projects Completed</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
                <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                <div className="text-gray-700">Equipment Fleet</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
                <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-gray-700">Support Available</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20">
                <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
                <div className="text-gray-700">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
