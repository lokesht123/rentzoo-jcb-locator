
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Settings, Briefcase, Calendar, MapPin, DollarSign, Clock, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';

const OperatorDashboard = ({ profile }: { profile: any }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [operatorProfile, setOperatorProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    license_number: '',
    experience_years: 0,
    hourly_rate: 0,
    location: '',
    bio: '',
    equipment_types: [] as string[],
    is_available: false
  });

  useEffect(() => {
    fetchOperatorProfile();
    fetchAvailableJobs();
    fetchMyBookings();
  }, [user]);

  const fetchOperatorProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('operator_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setOperatorProfile(data);
        setProfileForm({
          license_number: data.license_number || '',
          experience_years: data.experience_years || 0,
          hourly_rate: data.hourly_rate || 0,
          location: data.location || '',
          bio: data.bio || '',
          equipment_types: data.equipment_types || [],
          is_available: data.is_available || false
        });
      }
    } catch (error) {
      console.error('Error fetching operator profile:', error);
    }
  };

  const fetchAvailableJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles:client_id (full_name)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          jobs:job_id (title, equipment_type),
          client:client_id (full_name)
        `)
        .eq('operator_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (operatorProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('operator_profiles')
          .update(profileForm)
          .eq('user_id', user?.id);
        
        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('operator_profiles')
          .insert([{
            user_id: user?.id,
            ...profileForm
          }]);
        
        if (error) throw error;
      }
      
      toast({
        title: "Profile Updated!",
        description: "Your operator profile has been saved successfully."
      });
      
      fetchOperatorProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBookJob = async (jobId: string, clientId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([{
          job_id: jobId,
          operator_id: user?.id,
          client_id: clientId,
          message: 'I am interested in this job and available to start immediately.',
          status: 'pending'
        }]);

      if (error) throw error;
      
      toast({
        title: "Booking Request Sent!",
        description: "Your booking request has been sent to the client."
      });
      
      fetchMyBookings();
    } catch (error) {
      console.error('Error booking job:', error);
      toast({
        title: "Error",
        description: "Failed to send booking request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addEquipmentType = (type: string) => {
    if (!profileForm.equipment_types.includes(type)) {
      setProfileForm({
        ...profileForm,
        equipment_types: [...profileForm.equipment_types, type]
      });
    }
  };

  const removeEquipmentType = (type: string) => {
    setProfileForm({
      ...profileForm,
      equipment_types: profileForm.equipment_types.filter(t => t !== type)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-slate-50">
      <Navigation />
      
      <div className="pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header with back navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                Operator Dashboard
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Welcome, {profile?.full_name || user?.email}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="jobs">Available Jobs</TabsTrigger>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-orange-600" />
                    Operator Profile
                  </CardTitle>
                  <CardDescription>
                    Complete your profile to get more job opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="license_number">License Number</Label>
                        <Input
                          id="license_number"
                          placeholder="Your operator license number"
                          value={profileForm.license_number}
                          onChange={(e) => setProfileForm({ ...profileForm, license_number: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience_years">Experience (Years)</Label>
                        <Input
                          id="experience_years"
                          type="number"
                          min="0"
                          value={profileForm.experience_years}
                          onChange={(e) => setProfileForm({ ...profileForm, experience_years: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hourly_rate">Hourly Rate (₹)</Label>
                        <Input
                          id="hourly_rate"
                          type="number"
                          min="0"
                          step="100"
                          value={profileForm.hourly_rate}
                          onChange={(e) => setProfileForm({ ...profileForm, hourly_rate: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="Your operating area"
                          value={profileForm.location}
                          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell clients about your experience and expertise..."
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Equipment Types</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {profileForm.equipment_types.map((type) => (
                          <span
                            key={type}
                            className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-orange-200"
                            onClick={() => removeEquipmentType(type)}
                          >
                            {type} ×
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['JCB 3DX Super', 'JCB 3CX Eco', 'JCB JS220', 'Excavator', 'Bulldozer'].map((type) => (
                          <Button
                            key={type}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addEquipmentType(type)}
                            disabled={profileForm.equipment_types.includes(type)}
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_available"
                        checked={profileForm.is_available}
                        onCheckedChange={(checked) => setProfileForm({ ...profileForm, is_available: checked })}
                      />
                      <Label htmlFor="is_available">Available for new jobs</Label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    >
                      Save Profile
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Available Jobs</h2>
                {jobs.length === 0 ? (
                  <Card className="bg-white/80 backdrop-blur-md border-white/20">
                    <CardContent className="pt-6">
                      <div className="text-center text-gray-500">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No jobs available right now</p>
                        <p className="text-sm">Check back later for new opportunities</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {jobs.map((job) => (
                      <Card key={job.id} className="bg-white/80 backdrop-blur-md border-white/20 shadow-lg">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{job.title}</h3>
                              <p className="text-gray-600">{job.equipment_type}</p>
                              <p className="text-sm text-gray-500">Client: {job.profiles?.full_name}</p>
                            </div>
                            <Button
                              onClick={() => handleBookJob(job.id, job.client_id)}
                              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                            >
                              Book Job
                            </Button>
                          </div>
                          
                          <p className="text-gray-700 mb-4">{job.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(job.start_date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              {job.duration_hours}h
                            </div>
                            <div className="flex items-center text-gray-600">
                              <DollarSign className="h-4 w-4 mr-1" />
                              ₹{job.budget_per_hour}/hr
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="bookings">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">My Bookings</h2>
                {bookings.length === 0 ? (
                  <Card className="bg-white/80 backdrop-blur-md border-white/20">
                    <CardContent className="pt-6">
                      <div className="text-center text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No bookings yet</p>
                        <p className="text-sm">Browse available jobs and send booking requests</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="bg-white/80 backdrop-blur-md border-white/20 shadow-lg">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold">{booking.jobs?.title}</h3>
                              <p className="text-gray-600">Client: {booking.client?.full_name}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                          
                          {booking.message && (
                            <div className="bg-gray-50 p-3 rounded-lg mb-4">
                              <p className="text-sm text-gray-700">{booking.message}</p>
                            </div>
                          )}
                          
                          <p className="text-sm text-gray-500">
                            Applied on {new Date(booking.created_at).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;
