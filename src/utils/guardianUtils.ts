
import { supabase } from '@/integrations/supabase/client';

export const createGuardianPlayerRelationship = async (
  playerEmail: string,
  guardianUserId: string,
  playerName?: string
) => {
  try {
    console.log("Creating guardian-player relationship for:", { playerEmail, guardianUserId, playerName });
    
    // First, find players with matching guardian_email
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('id, name, guardian_email, team_id')
      .ilike('guardian_email', playerEmail);

    if (playersError) {
      console.error("Error finding players:", playersError);
      return false;
    }

    if (!players || players.length === 0) {
      console.log("No players found with guardian_email:", playerEmail);
      return false;
    }

    console.log("Found players:", players);

    // Create guardian relationships for all matching players
    const relationships = players.map(player => ({
      player_id: player.id,
      guardian_user_id: guardianUserId,
      relationship_type: 'parent' as const,
      can_edit: true,
      can_view_stats: true
    }));

    const { error: relationshipError } = await supabase
      .from('player_guardians')
      .upsert(relationships, { 
        onConflict: 'player_id,guardian_user_id',
        ignoreDuplicates: true 
      });

    if (relationshipError) {
      console.error("Error creating guardian relationships:", relationshipError);
      return false;
    }

    console.log("Successfully created guardian relationships for", relationships.length, "players");
    return true;
  } catch (error) {
    console.error("Error in createGuardianPlayerRelationship:", error);
    return false;
  }
};

export const establishGuardianRelationshipsOnLogin = async (userEmail: string, userId: string) => {
  try {
    console.log("Establishing guardian relationships on login for:", userEmail);
    
    // Find all players where this user's email matches the guardian_email
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('id, name, guardian_email, team_id')
      .ilike('guardian_email', userEmail);

    if (playersError) {
      console.error("Error finding players for guardian relationship:", playersError);
      return false;
    }

    if (!players || players.length === 0) {
      console.log("No players found for guardian relationship with email:", userEmail);
      return false;
    }

    console.log("Found players for guardian relationship:", players);

    // Check which relationships already exist
    const { data: existingRelationships, error: existingError } = await supabase
      .from('player_guardians')
      .select('player_id')
      .eq('guardian_user_id', userId);

    if (existingError) {
      console.error("Error checking existing relationships:", existingError);
    }

    const existingPlayerIds = existingRelationships?.map(rel => rel.player_id) || [];

    // Create relationships for players that don't already have them
    const newRelationships = players
      .filter(player => !existingPlayerIds.includes(player.id))
      .map(player => ({
        player_id: player.id,
        guardian_user_id: userId,
        relationship_type: 'parent' as const,
        can_edit: true,
        can_view_stats: true
      }));

    if (newRelationships.length > 0) {
      const { error: relationshipError } = await supabase
        .from('player_guardians')
        .insert(newRelationships);

      if (relationshipError) {
        console.error("Error creating new guardian relationships:", relationshipError);
        return false;
      }

      console.log("Successfully created", newRelationships.length, "new guardian relationships");
    } else {
      console.log("All guardian relationships already exist");
    }

    return true;
  } catch (error) {
    console.error("Error in establishGuardianRelationshipsOnLogin:", error);
    return false;
  }
};
