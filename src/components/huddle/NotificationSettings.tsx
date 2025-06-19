
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface NotificationSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSettings: {
    emailNewPosts: boolean;
    pushNewPosts: boolean;
    emailComments: boolean;
    pushComments: boolean;
  };
  onSaveSettings: (settings: {
    emailNewPosts: boolean;
    pushNewPosts: boolean;
    emailComments: boolean;
    pushComments: boolean;
  }) => void;
}

const NotificationSettings = ({
  open,
  onOpenChange,
  initialSettings,
  onSaveSettings
}: NotificationSettingsProps) => {
  const [settings, setSettings] = useState(initialSettings);

  const handleSave = () => {
    onSaveSettings(settings);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-blitz-charcoal text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Notification Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-medium">New Announcements</h4>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Email notifications</label>
              <Switch 
                checked={settings.emailNewPosts} 
                onCheckedChange={(checked) => 
                  setSettings({...settings, emailNewPosts: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Push notifications</label>
              <Switch 
                checked={settings.pushNewPosts}
                onCheckedChange={(checked) => 
                  setSettings({...settings, pushNewPosts: checked})
                }
              />
            </div>
          </div>
          
          <div className="pt-3 border-t border-gray-800 space-y-4">
            <h4 className="font-medium">Comments & Replies</h4>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Email notifications</label>
              <Switch 
                checked={settings.emailComments}
                onCheckedChange={(checked) => 
                  setSettings({...settings, emailComments: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Push notifications</label>
              <Switch 
                checked={settings.pushComments}
                onCheckedChange={(checked) => 
                  setSettings({...settings, pushComments: checked})
                }
              />
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              onClick={handleSave}
              className="w-full bg-blitz-purple hover:bg-blitz-purple/90"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSettings;
