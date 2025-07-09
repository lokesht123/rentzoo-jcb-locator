
import { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, MessageCircle, Navigation, Truck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Tracking = () => {
  const [activeBooking, setActiveBooking] = useState({
    id: 'JCB-2024-001',
    operatorName: 'Suresh Singh',
    operatorPhone: '+91 9876543210',
    jcbType: 'JCB 3DX Super',
    status: 'en_route',
    estimatedArrival: '15 minutes',
    currentLocation: 'MG Road, Bangalore',
    destination: 'Construction Site, Whitefield',
    startTime: '10:00 AM',
    estimatedDuration: '4 hours',
    hourlyRate: 1500,
    progress: 45,
    milestones: [
      { id: 1, title: 'Booking Confirmed', completed: true, time: '09:30 AM' },
      { id: 2, title: 'Operator Assigned', completed: true, time: '09:45 AM' },
      { id: 3, title: 'En Route to Site', completed: true, time: '10:15 AM' },
      { id: 4, title: 'Arrived at Site', completed: false, time: 'Est. 10:30 AM' },
      { id: 5, title: 'Work Started', completed: false, time: 'Est. 10:45 AM' },
      { id: 6, title: 'Work Completed', completed: false, time: 'Est. 02:45 PM' }
    ]
  });

  const { user } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'en_route': return 'bg-yellow-100 text-yellow-800';
      case 'arrived': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'en_route': return 'En Route';
      case 'arrived': return 'Arrived';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBooking(prev => ({
        ...prev,
        progress: Math.min(prev.progress + 1, 100)
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-cyan-50 to-yellow-100">
      <Navigation />
      
      <div className="pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Live Tracking
            </h1>
            <p className="text-lg text-gray-600">
              Track your JCB booking in real-time
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Live Status */}
            <div className="lg:col-span-2">
              <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-xl mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Booking #{activeBooking.id}</CardTitle>
                    <Badge className={getStatusColor(activeBooking.status)}>
                      {getStatusText(activeBooking.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
                      <Truck className="h-8 w-8 text-yellow-600" />
                      <div>
                        <h3 className="font-semibold text-lg">{activeBooking.jcbType}</h3>
                        <p className="text-gray-600">Operator: {activeBooking.operatorName}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-cyan-600" />
                        <div>
                          <p className="text-sm text-gray-600">Current Location</p>
                          <p className="font-medium">{activeBooking.currentLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Navigation className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="text-sm text-gray-600">Destination</p>
                          <p className="font-medium">{activeBooking.destination}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Estimated Arrival</p>
                          <p className="font-medium text-green-600">{activeBooking.estimatedArrival}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Work Progress</p>
                          <p className="font-medium">{activeBooking.progress}%</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm text-gray-600">{activeBooking.progress}%</span>
                      </div>
                      <Progress value={activeBooking.progress} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-xl">
                <CardHeader>
                  <CardTitle>Progress Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeBooking.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          milestone.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {milestone.completed ? '✓' : index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            milestone.completed ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {milestone.title}
                          </h4>
                          <p className="text-sm text-gray-500">{milestone.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact & Actions */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-xl">
                <CardHeader>
                  <CardTitle>Operator Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                      {activeBooking.operatorName.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-lg">{activeBooking.operatorName}</h3>
                    <p className="text-gray-600">{activeBooking.operatorPhone}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Operator
                    </Button>
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-xl">
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Time:</span>
                    <span className="font-medium">{activeBooking.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{activeBooking.estimatedDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hourly Rate:</span>
                    <span className="font-medium">₹{activeBooking.hourlyRate}</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between font-semibold">
                    <span>Estimated Total:</span>
                    <span>₹{activeBooking.hourlyRate * 4}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-xl">
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-gray-600 mb-3">Need immediate assistance?</p>
                    <Button variant="destructive" className="w-full">
                      <Phone className="mr-2 h-4 w-4" />
                      Emergency Support
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">24/7 Support Available</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Tracking;
