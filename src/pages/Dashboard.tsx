
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
        // Don't throw error, just set profile to null
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-slate-50">
        {/* Navigation Header */}
        <div className="bg-white/90 backdrop-blur-md border-b border-white/20 shadow-lg p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button onClick={handleGoHome} variant="outline" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </div>
            <Button onClick={handleSignOut} variant="ghost" className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Setup Required</h2>
            <p className="text-gray-600 mb-6">Your profile needs to be set up. Please try logging in again or contact support if the issue persists.</p>
            <div className="space-y-3">
              <Button onClick={handleGoHome} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Button>
              <Button onClick={handleSignOut} variant="outline" className="w-full">
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-slate-50">
      {profile.role === 'operator' ? (
        <OperatorDashboard profile={profile} />
      ) : (
        <ClientDashboard profile={profile} />
      )}
    </div>
  );
};

export default Dashboard;
