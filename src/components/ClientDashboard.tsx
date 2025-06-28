
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Calendar, MapPin, DollarSign, Clock, ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';

const ClientDashboard = ({ profile }: { profile: any }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('jobs');
  
  // Job form state
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    equipment_type: '',
    location: '',
    start_date: '',
    duration_hours: 1,
    budget_per_hour: 0
  });

  useEffect(() => {
    fetchJobs();
    fetchBookings();
  }, [user]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('client_id', user?.id)
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
        .from('bookings')
        .select(`
          *,
          jobs:job_id (title, equipment_type),
          operator:operator_id (full_name)
        `)
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('jobs')
        .insert([{
          client_id: user?.id,
          ...jobForm
        }]);

      if (error) throw error;
      
      toast({
        title: "Job Posted Successfully!",
        description: "Your job has been posted and operators will be able to see it."
      });
      
      // Reset form
      setJobForm({
        title: '',
        description: '',
        equipment_type: '',
        location: '',
        start_date: '',
        duration_hours: 1,
        budget_per_hour: 0
      });
      
      // Refresh jobs list
      fetchJobs();
      
      // Switch to jobs tab to show the new job
      setActiveTab('jobs');
      
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive"
      });
    }
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
                Client Dashboard
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Welcome, {profile?.full_name || user?.email}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="post">Post Job</TabsTrigger>
              <TabsTrigger value="jobs">My Jobs</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="post">
              <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2 text-orange-600" />
                    Post New Job
                  </CardTitle>
                  <CardDescription>
                    Describe your project and find the right equipment operator
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleJobSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Excavation for Foundation"
                          value={jobForm.title}
                          onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="equipment_type">Equipment Type</Label>
                        <Select 
                          value={jobForm.equipment_type} 
                          onValueChange={(value) => setJobForm({ ...jobForm, equipment_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select equipment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="JCB 3DX Super">JCB 3DX Super</SelectItem>
                            <SelectItem value="JCB 3CX Eco">JCB 3CX Eco</SelectItem>
                            <SelectItem value="JCB JS220">JCB JS220</SelectItem>
                            <SelectItem value="Excavator">Excavator</SelectItem>
                            <SelectItem value="Bulldozer">Bulldozer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your project requirements..."
                        value={jobForm.description}
                        onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="Project location"
                          value={jobForm.location}
                          onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input
                          id="start_date"
                          type="date"
                          value={jobForm.start_date}
                          onChange={(e) => setJobForm({ ...jobForm, start_date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration_hours">Duration (Hours)</Label>
                        <Input
                          id="duration_hours"
                          type="number"
                          min="1"
                          value={jobForm.duration_hours}
                          onChange={(e) => setJobForm({ ...jobForm, duration_hours: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget_per_hour">Budget per Hour (₹)</Label>
                      <Input
                        id="budget_per_hour"
                        type="number"
                        min="0"
                        step="100"
                        value={jobForm.budget_per_hour}
                        onChange={(e) => setJobForm({ ...jobForm, budget_per_hour: parseFloat(e.target.value) })}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    >
                      Post Job
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">My Posted Jobs</h2>
                {jobs.length === 0 ? (
                  <Card className="bg-white/80 backdrop-blur-md border-white/20">
                    <CardContent className="pt-6">
                      <div className="text-center text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No jobs posted yet</p>
                        <p className="text-sm">Click on "Post Job" to create your first job posting</p>
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
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              job.status === 'open' ? 'bg-green-100 text-green-800' :
                              job.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                              job.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </span>
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
                        <p className="text-sm">Operators will send booking requests for your posted jobs</p>
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
                              <p className="text-gray-600">Operator: {booking.operator?.full_name}</p>
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
                            Requested on {new Date(booking.created_at).toLocaleDateString()}
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

export default ClientDashboard;
