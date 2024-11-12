import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface NotificationPreferences {
  emailUpdates: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  newFeatures: boolean;
}

export default function NotificationSettings() {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailUpdates: true,
    securityAlerts: true,
    marketingEmails: false,
    newFeatures: true,
  });

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        notificationPreferences: preferences,
        updatedAt: new Date(),
      });

      toast({
        title: "Preferences Updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notification preferences.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Email Notifications</CardTitle>
          <CardDescription className="text-gray-300">
            Choose what updates you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium text-white">Email Updates</h3>
                <p className="text-sm text-gray-300">Receive updates about your account</p>
              </div>
              <Switch
                checked={preferences.emailUpdates}
                onCheckedChange={() => handleToggle('emailUpdates')}
                disabled={loading}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium text-white">Security Alerts</h3>
                <p className="text-sm text-gray-300">Get notified about security events</p>
              </div>
              <Switch
                checked={preferences.securityAlerts}
                onCheckedChange={() => handleToggle('securityAlerts')}
                disabled={loading}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium text-white">Marketing Emails</h3>
                <p className="text-sm text-gray-300">Receive promotional content and offers</p>
              </div>
              <Switch
                checked={preferences.marketingEmails}
                onCheckedChange={() => handleToggle('marketingEmails')}
                disabled={loading}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium text-white">New Features</h3>
                <p className="text-sm text-gray-300">Be the first to know about new features</p>
              </div>
              <Switch
                checked={preferences.newFeatures}
                onCheckedChange={() => handleToggle('newFeatures')}
                disabled={loading}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}