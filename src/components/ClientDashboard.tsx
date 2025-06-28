
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Clock, User, Phone, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ClientDashboard = ({ profile }: { profile: any }) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [availableOperators, setAvailableOperators] = useState<any[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signOut } = useAuth();

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    equipment_type: '',
    location: '',
    start_date: '',
    duration_hours: '',
    budget_per_hour: ''
  });

  useEffect(() => {
    fetchJobs();
    fetchBookings();
    fetchAvailableOperators();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs' as any)
        .select('*')
        .eq('client_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings' as any)
        .select(`
          *,
          jobs!inner(*),
          operator:operator_id(full_name, phone)
        `)
        .eq('client_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchAvailableOperators = async () => {
    try {
      const { data, error } = await supabase
        .from('operator_profiles' as any)
        .select(`
          *,
          profiles!inner(*)
        `)
        .eq('is_available', true);

      if (error) throw error;
      setAvailableOperators(data || []);
    } catch (error) {
      console.error('Error fetching operators:', error);
    }
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('jobs' as any)
        .insert([{
          ...jobForm,
          client_id: profile.id,
          duration_hours: parseInt(jobForm.duration_hours),
          budget_per_hour: parseFloat(jobForm.budget_per_hour)
        }]);

      if (error) throw error;

      toast({
        title: "Job Posted Successfully",
        description: "Your job has been posted and operators can now apply."
      });

      setJobForm({
        title: '',
        description: '',
        equipment_type: '',
        location: '',
        start_date: '',
        duration_hours: '',
        budget_per_hour: ''
      });
      setShowJobForm(false);
      fetchJobs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookOperator = async (operatorId: string, jobId?: string) => {
    try {
      const { error } = await supabase
        .from('bookings' as any)
        .insert([{
          operator_id: operatorId,
          client_id: profile.id,
          job_id: jobId,
          message: 'New booking request'
        }]);

      if (error) throw error;

      toast({
        title: "Booking Request Sent",
        description: "Your booking request has been sent to the operator."
      });

      fetchBookings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send booking request.",
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
          <h1 className="text-3xl font-bold text-gray-800">Client Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile.full_name}</p>
        </div>
        <Button onClick={signOut} variant="outline">
          Sign Out
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Job Management */}
        <Card>
          <CardHeader>
            <CardTitle>Job Management</CardTitle>
            <CardDescription>Post new jobs and manage existing ones</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowJobForm(!showJobForm)} 
              className="mb-4 bg-orange-500 hover:bg-orange-600"
            >
              {showJobForm ? 'Cancel' : 'Post New Job'}
            </Button>

            {showJobForm && (
              <form onSubmit={handleJobSubmit} className="space-y-4 mb-6">
                <Input
                  placeholder="Job Title"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  required
                />
                <Textarea
                  placeholder="Job Description"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  required
                />
                <Select value={jobForm.equipment_type} onValueChange={(value) => setJobForm({ ...jobForm, equipment_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Equipment Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jcb_3dx">JCB 3DX</SelectItem>
                    <SelectItem value="jcb_3cx">JCB 3CX</SelectItem>
                    <SelectItem value="excavator">Excavator</SelectItem>
                    <SelectItem value="bulldozer">Bulldozer</SelectItem>
                    <SelectItem value="crane">Crane</SelectItem>
                    <SelectItem value="loader">Loader</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Location"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  required
                />
                <Input
                  type="date"
                  value={jobForm.start_date}
                  onChange={(e) => setJobForm({ ...jobForm, start_date: e.target.value })}
                  required
                />
                <Input
                  type="number"
                  placeholder="Duration (hours)"
                  value={jobForm.duration_hours}
                  onChange={(e) => setJobForm({ ...jobForm, duration_hours: e.target.value })}
                  required
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Budget per hour (₹)"
                  value={jobForm.budget_per_hour}
                  onChange={(e) => setJobForm({ ...jobForm, budget_per_hour: e.target.value })}
                  required
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Posting...' : 'Post Job'}
                </Button>
              </form>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold">Your Jobs</h3>
              {jobs.length === 0 ? (
                <p className="text-gray-500">No jobs posted yet</p>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="p-3 border rounded-lg">
                    <h4 className="font-medium">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {job.equipment_type} • ₹{job.budget_per_hour}/hr
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        job.status === 'open' ? 'bg-green-100 text-green-800' :
                        job.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Available Operators */}
        <Card>
          <CardHeader>
            <CardTitle>Available Operators</CardTitle>
            <CardDescription>Browse and contact operators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableOperators.length === 0 ? (
                <p className="text-gray-500">No operators available</p>
              ) : (
                availableOperators.map((operator) => (
                  <div key={operator.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{operator.profiles?.full_name}</h4>
                        <p className="text-sm text-gray-600">
                          {operator.experience_years} years experience
                        </p>
                        <p className="text-sm text-orange-600 font-medium">
                          ₹{operator.hourly_rate}/hour
                        </p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Available
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{operator.bio}</p>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleBookOperator(operator.user_id)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Book Now
                      </Button>
                      {operator.profiles?.phone && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(getWhatsAppLink(operator.profiles.phone), '_blank')}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          WhatsApp
                        </Button>
                      )}
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
          <CardDescription>Track your booking requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <p className="text-gray-500">No bookings yet</p>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">
                        {booking.jobs?.title || 'Direct Booking'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Operator: {booking.operator?.full_name}
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
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
