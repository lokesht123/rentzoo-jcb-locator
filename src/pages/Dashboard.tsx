
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import OperatorDashboard from '@/components/OperatorDashboard';
import ClientDashboard from '@/components/ClientDashboard';
import { Loader2, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    try {
      // Check if user is admin by email
      if (user?.email === 'lokeshtanavarapu1@gmail.com' || user?.email === 'lokeshtanavarapu2@gmail.com') {
        navigate('/admin');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-cyan-50 to-yellow-100">
        {/* Navigation Header */}
        <div className="bg-white/20 backdrop-blur-xl border-b border-white/30 shadow-lg p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button onClick={handleGoHome} variant="outline" className="flex items-center space-x-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/ff4c2e1a-30c0-403e-b9a3-e50f07e36b24.png" 
                alt="RentZoo Logo" 
                className="h-8 w-auto"
              />
            </div>
            <Button onClick={handleSignOut} variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/30 max-w-md mx-4">
            <div className="mb-6">
              <img 
                src="/lovable-uploads/ff4c2e1a-30c0-403e-b9a3-e50f07e36b24.png" 
                alt="RentZoo Logo" 
                className="h-16 w-auto mx-auto mb-4"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Setup Required</h2>
            <p className="text-gray-600 mb-6">Your profile needs to be set up. Please try logging in again or contact support if the issue persists.</p>
            <div className="space-y-3">
              <Button onClick={handleGoHome} className="w-full bg-gradient-to-r from-yellow-500 to-cyan-500 hover:from-yellow-600 hover:to-cyan-600 shadow-lg">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Button>
              <Button onClick={handleSignOut} variant="outline" className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out & Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-cyan-50 to-yellow-100">
      {profile.role === 'operator' ? (
        <OperatorDashboard profile={profile} />
      ) : (
        <ClientDashboard profile={profile} />
      )}
    </div>
  );
};

export default Dashboard;
