import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Clock, User, Phone, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const OperatorDashboard = ({ profile }: { profile: any }) => {
  const [operatorProfile, setOperatorProfile] = useState<any>(null);
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signOut } = useAuth();

  const [profileForm, setProfileForm] = useState({
    license_number: '',
    experience_years: '',
    hourly_rate: '',
    location: '',
    bio: '',
    equipment_types: [] as string[],
    is_available: false
  });

  useEffect(() => {
    fetchOperatorProfile();
    fetchAvailableJobs();
    fetchBookings();
  }, []);

  const fetchOperatorProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('operator_profiles')
        .select('*')
        .eq('user_id', profile.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setOperatorProfile(data);
        setProfileForm({
          license_number: data.license_number || '',
          experience_years: data.experience_years?.toString() || '',
          hourly_rate: data.hourly_rate?.toString() || '',
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
          profiles!inner(*)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAvailableJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          jobs(*),
          client:client_id(full_name, phone)
        `)
        .eq('operator_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData = {
        user_id: profile.id,
        license_number: profileForm.license_number,
        experience_years: parseInt(profileForm.experience_years) || 0,
        hourly_rate: parseFloat(profileForm.hourly_rate) || 0,
        location: profileForm.location,
        bio: profileForm.bio,
        equipment_types: profileForm.equipment_types,
        is_available: profileForm.is_available
      };

      if (operatorProfile) {
        const { error } = await supabase
          .from('operator_profiles')
          .update(profileData)
          .eq('user_id', profile.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('operator_profiles')
          .insert([profileData]);
        if (error) throw error;
      }

      toast({
        title: "Profile Updated",
        description: "Your operator profile has been updated successfully."
      });

      fetchOperatorProfile();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([{
          job_id: jobId,
          operator_id: profile.id,
          client_id: availableJobs.find(job => job.id === jobId)?.client_id,
          message: 'Application for your job posting'
        }]);

      if (error) throw error;

      toast({
        title: "Application Sent",
        description: "Your application has been sent to the client."
      });

      fetchBookings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply to job.",
        variant: "destructive"
      });
    }
  };

  const handleBookingResponse = async (bookingId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: `Booking ${status}`,
        description: `You have ${status} the booking request.`
      });

      fetchBookings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive"
      });
    }
  };

  const getWhatsAppLink = (phone: string) => {
    const cleanPhone = phone?.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}`;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Operator Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile.full_name}</p>
        </div>
        <Button onClick={signOut} variant="outline">
          Sign Out
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Management */}
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Update your operator information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <Input
                placeholder="License Number"
                value={profileForm.license_number}
                onChange={(e) => setProfileForm({ ...profileForm, license_number: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Years of Experience"
                value={profileForm.experience_years}
                onChange={(e) => setProfileForm({ ...profileForm, experience_years: e.target.value })}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Hourly Rate (₹)"
                value={profileForm.hourly_rate}
                onChange={(e) => setProfileForm({ ...profileForm, hourly_rate: e.target.value })}
              />
              <Input
                placeholder="Location"
                value={profileForm.location}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
              />
              <Textarea
                placeholder="Bio / Description"
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              />
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={profileForm.is_available}
                  onCheckedChange={(checked) => setProfileForm({ ...profileForm, is_available: checked })}
                />
                <label>Available for work</label>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600">
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Available Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Available Jobs</CardTitle>
            <CardDescription>Browse and apply to jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableJobs.length === 0 ? (
                <p className="text-gray-500">No jobs available</p>
              ) : (
                availableJobs.map((job) => (
                  <div key={job.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium">{job.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.duration_hours} hours • ₹{job.budget_per_hour}/hr
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-500">
                        Posted by: {job.profiles?.full_name}
                      </span>
                      <Button 
                        size="sm" 
                        onClick={() => handleApplyToJob(job.id)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
          <CardDescription>Manage your booking requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <p className="text-gray-500">No bookings yet</p>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">
                        {booking.jobs?.title || 'Direct Booking'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Client: {booking.client?.full_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  {booking.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleBookingResponse(booking.id, 'accepted')}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleBookingResponse(booking.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  
                  {booking.status === 'accepted' && booking.client?.phone && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(getWhatsAppLink(booking.client.phone), '_blank')}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Contact Client
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OperatorDashboard;
