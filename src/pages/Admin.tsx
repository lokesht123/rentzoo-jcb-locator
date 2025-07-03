import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Briefcase, CheckCircle, XCircle, Loader2, Trash2, Settings, BarChart3, Edit, Plus } from 'lucide-react';

const Admin = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [operatorProfiles, setOperatorProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTable, setActiveTable] = useState('users');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      if (user.email !== 'lokeshtanavarapu1@gmail.com' && user.email !== 'lokeshtanavarapu2@gmail.com') {
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

      // Fetch operator profiles
      const { data: operatorProfilesData, error: operatorProfilesError } = await supabase
        .from('operator_profiles')
        .select(`
          *,
          profiles!inner(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (operatorProfilesError) throw operatorProfilesError;

      setUsers(usersData || []);
      setJobs(jobsData || []);
      setBookings(bookingsData || []);
      setOperatorProfiles(operatorProfilesData || []);
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-cyan-50 to-yellow-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-cyan-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  const tableOptions = [
    { key: 'users', label: 'Users', icon: Users, count: users.length },
    { key: 'jobs', label: 'Jobs', icon: Briefcase, count: jobs.length },
    { key: 'bookings', label: 'Bookings', icon: CheckCircle, count: bookings.length },
    { key: 'operators', label: 'Operators', icon: Settings, count: operatorProfiles.length },
  ];

  const renderUsersTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.full_name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant={user.role === 'admin' ? 'destructive' : 'default'}>
                {user.role}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={user.is_active ? 'default' : 'secondary'}>
                {user.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={user.is_active ? "destructive" : "default"}
                  onClick={() => toggleUserStatus(user.id, user.is_active)}
                >
                  {user.is_active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderJobsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Budget/Hour</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell className="font-medium">{job.title}</TableCell>
            <TableCell>{job.profiles?.full_name}</TableCell>
            <TableCell>{job.location}</TableCell>
            <TableCell>₹{job.budget_per_hour}</TableCell>
            <TableCell>
              <Badge variant={
                job.status === 'open' ? 'default' :
                job.status === 'assigned' ? 'secondary' :
                'outline'
              }>
                {job.status}
              </Badge>
            </TableCell>
            <TableCell>{new Date(job.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteJob(job.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderBookingsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job Title</TableHead>
          <TableHead>Operator</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell className="font-medium">
              {booking.jobs?.title || 'Direct Booking'}
            </TableCell>
            <TableCell>{booking.operator?.full_name}</TableCell>
            <TableCell>{booking.client?.full_name}</TableCell>
            <TableCell>
              <Badge variant={
                booking.status === 'pending' ? 'secondary' :
                booking.status === 'accepted' ? 'default' :
                booking.status === 'rejected' ? 'destructive' :
                'outline'
              }>
                {booking.status}
              </Badge>
            </TableCell>
            <TableCell className="max-w-xs truncate">{booking.message}</TableCell>
            <TableCell>{new Date(booking.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteBooking(booking.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderOperatorsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Experience</TableHead>
          <TableHead>Hourly Rate</TableHead>
          <TableHead>Available</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {operatorProfiles.map((operator) => (
          <TableRow key={operator.id}>
            <TableCell className="font-medium">{operator.profiles?.full_name}</TableCell>
            <TableCell>{operator.profiles?.email}</TableCell>
            <TableCell>{operator.experience_years} years</TableCell>
            <TableCell>₹{operator.hourly_rate}/hr</TableCell>
            <TableCell>
              <Badge variant={operator.is_available ? 'default' : 'secondary'}>
                {operator.is_available ? 'Available' : 'Busy'}
              </Badge>
            </TableCell>
            <TableCell>{operator.location}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderActiveTable = () => {
    switch (activeTable) {
      case 'users':
        return renderUsersTable();
      case 'jobs':
        return renderJobsTable();
      case 'bookings':
        return renderBookingsTable();
      case 'operators':
        return renderOperatorsTable();
      default:
        return renderUsersTable();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-cyan-50 to-yellow-100">
      {/* Admin Navigation Bar */}
      <div className="bg-white/20 backdrop-blur-xl border-b border-white/30 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/ff4c2e1a-30c0-403e-b9a3-e50f07e36b24.png" 
                alt="RentZoo Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-cyan-600 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </div>
            
            {/* Table Navigation */}
            <div className="flex items-center space-x-6">
              {tableOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.key}
                    onClick={() => setActiveTable(option.key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      activeTable === option.key
                        ? 'bg-gradient-to-r from-yellow-500 to-cyan-500 text-white shadow-lg'
                        : 'text-gray-600 hover:text-yellow-600 hover:bg-white/50'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="font-medium">{option.label}</span>
                    <Badge variant="secondary" className="ml-1">
                      {option.count}
                    </Badge>
                  </button>
                );
              })}
            </div>

            <Button onClick={signOut} variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {tableOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card key={option.key} className="bg-white/60 backdrop-blur-md border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{option.label}</CardTitle>
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-cyan-600 bg-clip-text text-transparent">
                    {option.count}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Table */}
        <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-2xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-yellow-600 to-cyan-600 bg-clip-text text-transparent">
                  {tableOptions.find(opt => opt.key === activeTable)?.label} Management
                </CardTitle>
                <CardDescription>
                  Manage and monitor {activeTable} in your system
                </CardDescription>
              </div>
              <Button className="bg-gradient-to-r from-yellow-500 to-cyan-500 hover:from-yellow-600 hover:to-cyan-600">
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {renderActiveTable()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
