
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  MapPin, 
  Clock, 
  DollarSign, 
  LogOut,
  MessageCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Navigation from './Navigation';

interface ClientDashboardProps {
  profile: any;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ profile }) => {
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [availableOperators, setAvailableOperators] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    equipment_type: '',
    location: '',
    start_date: '',
    duration_hours: '',
    budget_per_hour: ''
  });
  const { signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      // Fetch my jobs
      const { data: jobs } = await supabase
        .from('jobs' as any)
        .select('*')
        .eq('client_id', profile.id)
        .order('created_at', { ascending: false });

      setMyJobs(jobs || []);

      // Fetch available operators
      const { data: operators } = await supabase
        .from('operator_profiles' as any)
        .select(`
          *,
          profiles:user_id (
            full_name,
            phone
          )
        `)
        .eq('is_available', true);

      setAvailableOperators(operators || []);

      // Fetch bookings for my jobs
      const { data: bookingsData } = await supabase
        .from('bookings' as any)
        .select(`
          *,
          jobs (*),
          profiles:operator_id (
            full_name,
            phone
          )
        `)
        .eq('client_id', profile.id);

      setBookings(bookingsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('jobs' as any)
        .insert({
          ...jobForm,
          client_id: profile.id,
          duration_hours: parseInt(jobForm.duration_hours),
          budget_per_hour: parseFloat(jobForm.budget_per_hour)
        } as any);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job posted successfully!"
      });

      setShowJobDialog(false);
      setJobForm({
        title: '',
        description: '',
        equipment_type: '',
        location: '',
        start_date: '',
        duration_hours: '',
        budget_per_hour: ''
      });
      fetchClientData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post job",
        variant: "destructive"
      });
    }
  };

  const handleBookingResponse = async (bookingId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('bookings' as any)
        .update({ status } as any)
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Booking ${status} successfully`
      });

      fetchClientData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking",
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
              <h1 className="text-3xl font-bold text-gray-800">Client Dashboard</h1>
              <p className="text-gray-600">Welcome back, {profile.full_name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Post a New Job</DialogTitle>
                    <DialogDescription>
                      Fill in the details to find equipment operators
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleJobSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        value={jobForm.title}
                        onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={jobForm.description}
                        onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="equipment_type">Equipment Type</Label>
                      <Select value={jobForm.equipment_type} onValueChange={(value) => setJobForm({...jobForm, equipment_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select equipment type" />
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
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={jobForm.location}
                        onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={jobForm.start_date}
                        onChange={(e) => setJobForm({...jobForm, start_date: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration_hours">Duration (hours)</Label>
                      <Input
                        id="duration_hours"
                        type="number"
                        value={jobForm.duration_hours}
                        onChange={(e) => setJobForm({...jobForm, duration_hours: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget_per_hour">Budget per Hour (₹)</Label>
                      <Input
                        id="budget_per_hour"
                        type="number"
                        value={jobForm.budget_per_hour}
                        onChange={(e) => setJobForm({...jobForm, budget_per_hour: e.target.value})}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Post Job
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Jobs</p>
                    <p className="text-2xl font-bold text-orange-600">{myJobs.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Jobs</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {myJobs.filter(job => job.status === 'open' || job.status === 'in_progress').length}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Available Operators</p>
                    <p className="text-2xl font-bold text-green-600">{availableOperators.length}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* My Jobs */}
            <Card className="bg-white/80 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle>My Jobs</CardTitle>
                <CardDescription>Jobs you have posted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myJobs.map((job) => (
                    <div key={job.id} className="p-4 border rounded-lg bg-white/50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{job.title}</h4>
                        <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
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
                        <span className="text-sm text-gray-500">
                          {job.duration_hours} hours
                        </span>
                      </div>
                    </div>
                  ))}
                  {myJobs.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No jobs posted yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Booking Requests */}
            <Card className="bg-white/80 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle>Booking Requests</CardTitle>
                <CardDescription>Operators who applied for your jobs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="p-4 border rounded-lg bg-white/50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{booking.jobs?.title}</h4>
                        <Badge variant={booking.status === 'accepted' ? 'default' : booking.status === 'pending' ? 'secondary' : 'destructive'}>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        Applied by: {booking.profiles?.full_name}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {booking.jobs?.location}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">
                          ₹{booking.jobs?.budget_per_hour}/hour
                        </span>
                        <div className="flex space-x-2">
                          {booking.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleBookingResponse(booking.id, 'accepted')}
                                className="bg-green-500 hover:bg-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleBookingResponse(booking.id, 'rejected')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {booking.profiles?.phone && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openWhatsApp(booking.profiles.phone)}
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No booking requests yet</p>
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

export default ClientDashboard;
