
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface NotificationSettings {
  emailNewPosts: boolean;
  pushNewPosts: boolean;
  emailComments: boolean;
  pushComments: boolean;
}

interface NotificationsTabProps {
  notificationSettings: NotificationSettings;
  setIsNotificationSettingsOpen: (open: boolean) => void;
}

const NotificationsTab = ({
  notificationSettings,
  setIsNotificationSettingsOpen
}: NotificationsTabProps) => {
  return (
    <Card className="bg-blitz-darkgray border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg sm:text-xl break-words flex-1 pr-2">Notification Preferences</CardTitle>
        <Button
          onClick={() => setIsNotificationSettingsOpen(true)}
          className="bg-blitz-purple hover:bg-blitz-purple/90 text-xs sm:text-sm px-2 sm:px-4 py-2 flex-shrink-0"
        >
          <Settings size={16} className="mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Configure</span>
          <span className="sm:hidden">Config</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blitz-charcoal rounded-lg">
            <h4 className="font-medium mb-3 break-words">Current Settings</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-black break-words">Email Announcements:</p>
                <p className={`break-words ${notificationSettings.emailNewPosts ? "text-emerald-700" : "text-red-600"}`}>
                  {notificationSettings.emailNewPosts ? "Enabled" : "Disabled"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-black break-words">Push Announcements:</p>
                <p className={`break-words ${notificationSettings.pushNewPosts ? "text-emerald-700" : "text-red-600"}`}>
                  {notificationSettings.pushNewPosts ? "Enabled" : "Disabled"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-black break-words">Email Comments:</p>
                <p className={`break-words ${notificationSettings.emailComments ? "text-emerald-700" : "text-red-600"}`}>
                  {notificationSettings.emailComments ? "Enabled" : "Disabled"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-black break-words">Push Comments:</p>
                <p className={`break-words ${notificationSettings.pushComments ? "text-emerald-700" : "text-red-600"}`}>
                  {notificationSettings.pushComments ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
