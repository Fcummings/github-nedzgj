import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import Logo from '@/components/Logo';
import { analyticsEvents } from '@/lib/firebase';
import { getUserData } from '@/lib/db';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    analyticsEvents.pageView('dashboard_page');
    
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const data = await getUserData(currentUser.uid);
          if (data) {
            setUserData(data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Logo className="scale-75" />
          <div className="flex gap-4">
            <Button
              onClick={() => navigate('/settings')}
              className="bg-gray-700 hover:bg-gray-600"
              variant="outline"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-6">
            Welcome{userData ? `, ${userData.firstName}` : ''}!
          </h1>
          <p className="text-gray-300 mb-4">
            You're signed in as: <span className="text-blue-400">{userData?.email}</span>
          </p>
          <div className="mt-8 p-6 bg-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Getting Started</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Explore our payment solutions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Set up your payment preferences
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Connect your bank account
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Start making secure transactions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}