import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, Briefcase, CheckCircle, XCircle, Loader2, Trash2 } from 'lucide-react';

const Admin = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      // Check if user is admin by email
      if (user.email !== 'lokeshtanavarapu1@gmail.com') {
        navigate('/dashboard');
        return;
      }
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      fetchData();
    }
  }, [profile, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles!inner(full_name)
        `)
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          jobs(*),
          operator:operator_id(full_name),
          client:client_id(full_name)
        `)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      setUsers(usersData || []);
      setJobs(jobsData || []);
      setBookings(bookingsData || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin data.",
        variant: "destructive"
      });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "User Status Updated",
        description: `User has been ${!currentStatus ? 'activated' : 'deactivated'}.`
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive"
      });
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;

      toast({
        title: "Job Deleted",
        description: "Job has been successfully deleted."
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job.",
        variant: "destructive"
      });
    }
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Booking Deleted",
        description: "Booking has been successfully deleted."
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete booking.",
        variant: "destructive"
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-slate-50">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {profile.full_name}</p>
          </div>
          <Button onClick={signOut} variant="outline">
            Sign Out
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobs.filter(job => job.status === 'open').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Operators</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(user => user.role === 'operator').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Users Management */}
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{user.full_name}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant={user.role === 'admin' ? 'destructive' : 'default'}>
                          {user.role}
                        </Badge>
                        <Badge variant={user.is_active ? 'default' : 'secondary'}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={user.is_active ? "destructive" : "default"}
                      onClick={() => toggleUserStatus(user.id, user.is_active)}
                    >
                      {user.is_active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Jobs</CardTitle>
              <CardDescription>Latest job postings and activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {jobs.slice(0, 10).map((job) => (
                  <div key={job.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            By: {job.profiles?.full_name}
                          </span>
                          <Badge variant={
                            job.status === 'open' ? 'default' :
                            job.status === 'assigned' ? 'secondary' :
                            'outline'
                          }>
                            {job.status}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteJob(job.id)}
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Overview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest booking requests and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {bookings.slice(0, 15).map((booking) => (
                <div key={booking.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {booking.jobs?.title || 'Direct Booking'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Operator: {booking.operator?.full_name} | Client: {booking.client?.full_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        booking.status === 'pending' ? 'secondary' :
                        booking.status === 'accepted' ? 'default' :
                        booking.status === 'rejected' ? 'destructive' :
                        'outline'
                      }>
                        {booking.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteBooking(booking.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
