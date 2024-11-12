import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Shield, Bell, ChevronRight } from 'lucide-react';
import ProfileSettings from '@/components/settings/ProfileSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import Logo from '@/components/Logo';
import { cn } from '@/lib/utils';

type SettingTab = 'profile' | 'security' | 'notifications';

interface SettingOption {
  id: SettingTab;
  label: string;
  icon: React.ElementType;
  component: React.ComponentType;
}

const settingOptions: SettingOption[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: UserCircle,
    component: ProfileSettings,
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    component: SecuritySettings,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    component: NotificationSettings,
  },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingTab>('profile');

  const ActiveComponent = settingOptions.find(option => option.id === activeTab)?.component || ProfileSettings;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center p-4 border-b border-gray-800">
          <Link to="/">
            <Logo className="scale-75" />
          </Link>
          <h1 className="text-3xl font-bold text-white ml-4">Settings</h1>
        </div>

        <div className="flex">
          {/* Left Navigation */}
          <nav className="w-64 min-h-[calc(100vh-5rem)] bg-gray-800/50 border-r border-gray-800">
            <ul className="p-4 space-y-2">
              {settingOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <li key={option.id}>
                    <button
                      onClick={() => setActiveTab(option.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                        "hover:bg-gray-700/50",
                        activeTab === option.id
                          ? "bg-blue-600 text-white"
                          : "text-gray-300"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="flex-1">{option.label}</span>
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform",
                        activeTab === option.id ? "rotate-90" : ""
                      )} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Main Content */}
          <main className="flex-1 p-8">
            <div className="max-w-3xl">
              <ActiveComponent />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}