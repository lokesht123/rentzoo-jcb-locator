
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Phone, 
  Star, 
  Clock, 
  DollarSign, 
  Settings, 
  LogOut,
  CheckCircle,
  XCircle,
  MessageCircle
} from 'lucide-react';
import Navigation from './Navigation';

interface OperatorDashboardProps {
  profile: any;
}

const OperatorDashboard: React.FC<OperatorDashboardProps> = ({ profile }) => {
  const [operatorProfile, setOperatorProfile] = useState<any>(null);
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchOperatorData();
  }, []);

  const fetchOperatorData = async () => {
    try {
      // Fetch operator profile
      const { data: opProfile } = await supabase
        .from('operator_profiles' as any)
        .select('*')
        .eq('user_id', profile.id)
        .single();

      setOperatorProfile(opProfile);

      // Fetch available jobs
      const { data: jobs } = await supabase
        .from('jobs' as any)
        .select(`
          *,
          profiles:client_id (
            full_name,
            phone
          )
        `)
        .eq('status', 'open');

      setAvailableJobs(jobs || []);

      // Fetch my bookings
      const { data: bookings } = await supabase
        .from('bookings' as any)
        .select(`
          *,
          jobs (*),
          profiles:client_id (
            full_name,
            phone
          )
        `)
        .eq('operator_id', profile.id);

      setMyBookings(bookings || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    if (!operatorProfile) return;

    try {
      const { error } = await supabase
        .from('operator_profiles' as any)
        .update({ is_available: !operatorProfile.is_available } as any)
        .eq('user_id', profile.id);

      if (error) throw error;

      setOperatorProfile({
        ...operatorProfile,
        is_available: !operatorProfile.is_available
      });

      toast({
        title: "Success",
        description: `You are now ${!operatorProfile.is_available ? 'available' : 'unavailable'} for jobs`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive"
      });
    }
  };

  const applyForJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('bookings' as any)
        .insert({
          job_id: jobId,
          operator_id: profile.id,
          client_id: availableJobs.find(job => job.id === jobId)?.client_id,
          status: 'pending'
        } as any);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job application submitted successfully"
      });

      fetchOperatorData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply for job",
        variant: "destructive"
      });
    }
  };

  const openWhatsApp = (phone: string) => {
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <>
      <Navigation />
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Operator Dashboard</h1>
              <p className="text-gray-600">Welcome back, {profile.full_name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={toggleAvailability}
                variant={operatorProfile?.is_available ? "default" : "outline"}
                className="bg-green-500 hover:bg-green-600"
              >
                {operatorProfile?.is_available ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Available
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Unavailable
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Jobs</p>
                    <p className="text-2xl font-bold text-orange-600">{operatorProfile?.total_jobs || 0}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="text-2xl font-bold text-yellow-600">{operatorProfile?.rating || 0}/5</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Hourly Rate</p>
                    <p className="text-2xl font-bold text-green-600">₹{operatorProfile?.hourly_rate || 0}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge variant={operatorProfile?.is_available ? "default" : "secondary"}>
                      {operatorProfile?.is_available ? "Available" : "Busy"}
                    </Badge>
                  </div>
                  <Settings className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Jobs */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-white/80 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle>Available Jobs</CardTitle>
                <CardDescription>Jobs you can apply for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableJobs.map((job) => (
                    <div key={job.id} className="p-4 border rounded-lg bg-white/50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{job.title}</h4>
                        <Badge>{job.equipment_type}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{job.description}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">
                          ₹{job.budget_per_hour}/hour
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => applyForJob(job.id)}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            Apply
                          </Button>
                          {job.profiles?.phone && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openWhatsApp(job.profiles.phone)}
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {availableJobs.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No jobs available at the moment</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* My Bookings */}
            <Card className="bg-white/80 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>Your job applications and bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myBookings.map((booking) => (
                    <div key={booking.id} className="p-4 border rounded-lg bg-white/50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{booking.jobs?.title}</h4>
                        <Badge variant={booking.status === 'accepted' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{booking.jobs?.description}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {booking.jobs?.location}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">
                          ₹{booking.jobs?.budget_per_hour}/hour
                        </span>
                        {booking.profiles?.phone && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openWhatsApp(booking.profiles.phone)}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Contact Client
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {myBookings.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No applications yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default OperatorDashboard;
