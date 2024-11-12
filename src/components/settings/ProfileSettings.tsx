import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { getUserData } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export default function ProfileSettings() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
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

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Personal Information</CardTitle>
          <CardDescription className="text-gray-300">
            View and manage your personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              value={userData?.firstName || ''}
              placeholder="First Name"
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              disabled
            />
            <p className="text-sm text-gray-300 mt-1">First name cannot be changed</p>
          </div>

          <div>
            <Input
              value={userData?.lastName || ''}
              placeholder="Last Name"
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              disabled
            />
            <p className="text-sm text-gray-300 mt-1">Last name cannot be changed</p>
          </div>

          <div>
            <Input
              value={currentUser?.email || ''}
              placeholder="Email"
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              disabled
            />
            <p className="text-sm text-gray-300 mt-1">Email cannot be changed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}