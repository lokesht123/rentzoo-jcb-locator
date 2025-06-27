
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Briefcase, 
  Shield, 
  CheckCircle, 
  XCircle,
  Eye,
  LogOut
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    if (user) {
      checkAdminAccess();
    }
  }, [user]);

  const checkAdminAccess = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles' as any)
        .select('role')
        .eq('id', user?.id)
        .single();

      if (profile?.role !== 'admin') {
        navigate('/dashboard');
        return;
      }

      fetchAdminData();
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/dashboard');
    }
  };

  const fetchAdminData = async () => {
    try {
      // Fetch all users
      const { data: usersData } = await supabase
        .from('profiles' as any)
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch all jobs
      const { data: jobsData } = await supabase
        .from('jobs' as any)
        .select(`
          *,
          profiles:client_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // Fetch all bookings
      const { data: bookingsData } = await supabase
        .from('bookings' as any)
        .select(`
          *,
          jobs (*),
          operator_profile:operator_id (
            full_name,
            email
          ),
          client_profile:client_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      setUsers(usersData || []);
      setJobs(jobsData || []);
      setBookings(bookingsData || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles' as any)
        .update({ is_active: !currentStatus } as any)
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      });

      fetchAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const verifyUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles' as any)
        .update({ is_verified: true } as any)
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User verified successfully"
      });

      fetchAdminData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify user",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="p-8">Loading admin dashboard...</div>;
  }

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.is_active).length,
    operators: users.filter(u => u.role === 'operator').length,
    clients: users.filter(u => u.role === 'client').length,
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === 'open' || j.status === 'in_progress').length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length
  };

  return (
    <>
      <Navigation />
      <div className="pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600">Monitor and manage RentZoo platform</p>
            </div>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Jobs</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.activeJobs}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Operators</p>
                    <p className="text-2xl font-bold text-green-600">{stats.operators}</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Bookings</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</p>
                  </div>
                  <Eye className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Tabs */}
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{user.full_name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={user.role === 'operator' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                            {user.is_verified && (
                              <Badge variant="outline" className="text-green-600">
                                Verified
                              </Badge>
                            )}
                            {!user.is_active && (
                              <Badge variant="destructive">
                                Inactive
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {!user.is_verified && (
                            <Button
                              size="sm"
                              onClick={() => verifyUser(user.id)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant={user.is_active ? "destructive" : "default"}
                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                          >
                            {user.is_active ? (
                              <XCircle className="h-4 w-4" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs">
              <Card>
                <CardHeader>
                  <CardTitle>Job Management</CardTitle>
                  <CardDescription>Monitor all job postings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{job.title}</h4>
                          <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                            {job.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                        <p className="text-sm text-gray-500">
                          Posted by: {job.profiles?.full_name} • Budget: ₹{job.budget_per_hour}/hr
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Management</CardTitle>
                  <CardDescription>Monitor all booking requests and transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{booking.jobs?.title}</h4>
                          <Badge variant={booking.status === 'accepted' ? 'default' : booking.status === 'pending' ? 'secondary' : 'destructive'}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Operator: {booking.operator_profile?.full_name} • 
                          Client: {booking.client_profile?.full_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Budget: ₹{booking.jobs?.budget_per_hour}/hr
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Admin;
