
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, UserCheck, AlertCircle } from 'lucide-react';

interface GuardianInfo {
  email: string;
  name?: string;
  user_id?: string;
  relationship_exists: boolean;
}

const GuardianRelationshipTab = () => {
  const { user } = useAuth();
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [existingGuardians, setExistingGuardians] = useState<GuardianInfo[]>([]);
  const [playerData, setPlayerData] = useState<any>(null);

  // Fetch existing guardian relationships and player data
  useEffect(() => {
    if (user?.id) {
      fetchPlayerData();
      fetchExistingGuardians();
    }
  }, [user?.id]);

  const fetchPlayerData = async () => {
    try {
      const { data: players, error } = await supabase
        .from('players')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching player data:', error);
        return;
      }

      setPlayerData(players);
      
      // Pre-fill form with existing guardian info if available
      if (players?.guardian_email) {
        setGuardianEmail(players.guardian_email);
        setGuardianName(players.guardian_name || '');
      }
    } catch (error) {
      console.error('Error fetching player data:', error);
    }
  };

  const fetchExistingGuardians = async () => {
    try {
      // First get the guardian relationships
      const { data: guardianRelationships, error } = await supabase
        .from('player_guardians')
        .select(`
          *,
          players!inner(user_id)
        `)
        .eq('players.user_id', user?.id);

      if (error) {
        console.error('Error fetching guardian relationships:', error);
        return;
      }

      if (!guardianRelationships || guardianRelationships.length === 0) {
        setExistingGuardians([]);
        return;
      }

      // Then get user profile information for each guardian
      const guardianUserIds = guardianRelationships.map(rel => rel.guardian_user_id);
      
      const { data: userProfiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, display_name, email')
        .in('id', guardianUserIds);

      if (profileError) {
        console.error('Error fetching user profiles:', profileError);
        return;
      }

      // Combine the data
      const guardianInfos: GuardianInfo[] = guardianRelationships.map(rel => {
        const profile = userProfiles?.find(p => p.id === rel.guardian_user_id);
        return {
          email: profile?.email || '',
          name: profile?.display_name || '',
          user_id: rel.guardian_user_id,
          relationship_exists: true
        };
      });

      setExistingGuardians(guardianInfos);
    } catch (error) {
      console.error('Error fetching existing guardians:', error);
      setExistingGuardians([]);
    }
  };

  const handleCreateGuardianRelationship = async () => {
    if (!guardianEmail.trim()) {
      toast.error('Please enter a guardian email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guardianEmail.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // First, find if a user exists with this email
      const { data: guardianUser, error: userError } = await supabase
        .from('user_profiles')
        .select('id, display_name, email')
        .eq('email', guardianEmail.trim().toLowerCase())
        .single();

      if (userError && userError.code !== 'PGRST116') {
        console.error('Error finding guardian user:', userError);
        toast.error('Error searching for guardian account');
        return;
      }

      // Get the player record for this user
      const { data: playerRecord, error: playerError } = await supabase
        .from('players')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (playerError) {
        console.error('Error finding player record:', playerError);
        toast.error('Player record not found');
        return;
      }

      if (guardianUser) {
        // Guardian user exists, create the relationship
        const { error: relationshipError } = await supabase
          .from('player_guardians')
          .insert({
            player_id: playerRecord.id,
            guardian_user_id: guardianUser.id,
            relationship_type: 'parent',
            can_edit: true,
            can_view_stats: true
          });

        if (relationshipError) {
          if (relationshipError.code === '23505') {
            toast.error('Guardian relationship already exists');
          } else {
            console.error('Error creating guardian relationship:', relationshipError);
            toast.error('Failed to create guardian relationship');
          }
          return;
        }

        toast.success(`Guardian relationship created with ${guardianUser.display_name || guardianUser.email}`);
      } else {
        // Guardian user doesn't exist, just update player record and show info
        toast.info('Guardian account not found. Guardian email saved - they can create an account later to access your information.');
      }

      // Update player record with guardian information
      const { error: updateError } = await supabase
        .from('players')
        .update({
          guardian_email: guardianEmail.trim().toLowerCase(),
          guardian_name: guardianName.trim() || null
        })
        .eq('id', playerRecord.id);

      if (updateError) {
        console.error('Error updating player guardian info:', updateError);
        toast.error('Failed to save guardian information');
        return;
      }

      // Refresh the data
      await fetchPlayerData();
      await fetchExistingGuardians();
      
    } catch (error) {
      console.error('Error creating guardian relationship:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== 'player') {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-2" />
            <p>This feature is only available for player accounts.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Guardian Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Add Guardian
          </CardTitle>
          <CardDescription>
            Add your parent or guardian's email so they can view your teams and stats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guardianEmail">Guardian Email *</Label>
            <Input
              id="guardianEmail"
              type="email"
              value={guardianEmail}
              onChange={(e) => setGuardianEmail(e.target.value)}
              placeholder="guardian@example.com"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="guardianName">Guardian Name (Optional)</Label>
            <Input
              id="guardianName"
              type="text"
              value={guardianName}
              onChange={(e) => setGuardianName(e.target.value)}
              placeholder="Guardian's full name"
              disabled={isLoading}
            />
          </div>

          <Button 
            onClick={handleCreateGuardianRelationship}
            disabled={isLoading || !guardianEmail.trim()}
            className="w-full"
          >
            {isLoading ? 'Saving...' : 'Save Guardian Information'}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Guardians Section */}
      {existingGuardians.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Active Guardian Relationships
            </CardTitle>
            <CardDescription>
              Guardians who can access your team and stats information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {existingGuardians.map((guardian, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-medium">{guardian.name || 'Guardian'}</span>
                    <span className="text-sm text-gray-500">{guardian.email}</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Connected
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How it works:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Enter your guardian's email address</li>
                <li>If they have an account, they'll immediately get access to your teams</li>
                <li>If they don't have an account, they can create one later using the same email</li>
                <li>Your guardian will be able to view your teams, schedule, and stats</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuardianRelationshipTab;
