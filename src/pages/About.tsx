
import { Users, Award, Clock, Shield, Target, Heart } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description: "15+ years in construction equipment industry"
    },
    {
      name: "Priya Sharma",
      role: "Operations Head",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      description: "Expert in logistics and fleet management"
    },
    {
      name: "Amit Singh",
      role: "Technical Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      description: "Mechanical engineer with construction expertise"
    }
  ];

  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Safety First",
      description: "All equipment meets highest safety standards with regular maintenance and inspections."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Reliability",
      description: "Dependable service with guaranteed equipment availability when you need it."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Customer Care",
      description: "Dedicated support team ensuring your project success is our priority."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Excellence",
      description: "Continuous improvement and innovation in service delivery and equipment quality."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              About RentZoo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leading the construction equipment rental industry with innovative solutions and exceptional service
            </p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Founded in 2009, RentZoo began with a simple mission: to make construction equipment rental 
                  as easy as booking a ride. What started as a small fleet of JCBs has grown into a comprehensive 
                  platform serving thousands of contractors across India.
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Today, we're proud to be the most trusted name in construction equipment rental, combining 
                  traditional reliability with modern technology to deliver unmatched service.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">2009</div>
                    <div className="text-gray-600">Founded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                    <div className="text-gray-600">Projects</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1487887235947-a955ef187fcc?w=600&h=400&fit=crop"
                  alt="Construction site"
                  className="rounded-2xl shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-12 text-white">
              <Target className="h-16 w-16 mb-6 opacity-80" />
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg leading-relaxed opacity-90">
                To revolutionize the construction equipment rental industry by providing instant access 
                to premium equipment through technology-driven solutions, ensuring every project has 
                the right tools at the right time.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-12 text-white">
              <Award className="h-16 w-16 mb-6 opacity-80" />
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg leading-relaxed opacity-90">
                To become India's most trusted construction equipment rental platform, empowering 
                builders and contractors with seamless access to quality equipment and exceptional 
                service nationwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500/10 to-blue-500/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <div className="text-orange-500 mb-4 flex justify-center group-hover:scale-110 transition-transform">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.02]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover group-hover:scale-105 transition-transform"
                  />
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-orange-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
