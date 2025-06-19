import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextOptimized';

export interface UserProfile {
  id: string;
  display_name: string | null;
  email: string | null;
  guardian_email: string | null;
  role: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  created_at: string;
  updated_at: string;
  other_participant?: UserProfile;
  last_message?: Message;
}

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Get conversations where user is a participant
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      if (!conversationsData || conversationsData.length === 0) {
        setConversations([]);
        return;
      }

      // Get other participants' profiles
      const otherParticipantIds = conversationsData.map(conv => 
        conv.participant_1_id === user.id ? conv.participant_2_id : conv.participant_1_id
      );

      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('id', otherParticipantIds);

      if (profilesError) throw profilesError;

      // Get last message for each conversation
      const conversationIds = conversationsData.map(conv => conv.id);
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Combine data
      const enrichedConversations: Conversation[] = conversationsData.map(conv => {
        const otherParticipantId = conv.participant_1_id === user.id ? conv.participant_2_id : conv.participant_1_id;
        const otherParticipant = profilesData?.find(profile => profile.id === otherParticipantId);
        const lastMessage = messagesData?.find(msg => msg.conversation_id === conv.id);

        return {
          ...conv,
          other_participant: otherParticipant,
          last_message: lastMessage
        };
      });

      setConversations(enrichedConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (searchTerm: string): Promise<UserProfile[]> => {
    if (!searchTerm.trim()) return [];

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .or(`display_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .neq('id', user?.id || '')
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  const startConversation = async (participantId: string): Promise<string | null> => {
    if (!user?.id) return null;

    try {
      // Check if conversation already exists
      const { data: existingConv, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant_1_id.eq.${user.id},participant_2_id.eq.${participantId}),and(participant_1_id.eq.${participantId},participant_2_id.eq.${user.id})`)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existingConv) {
        return existingConv.id;
      }

      // Create new conversation
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          participant_1_id: user.id,
          participant_2_id: participantId
        })
        .select('id')
        .single();

      if (createError) throw createError;

      fetchConversations(); // Refresh conversations list
      return newConv.id;
    } catch (error) {
      console.error('Error starting conversation:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user?.id]);

  return {
    conversations,
    loading,
    searchUsers,
    startConversation,
    refetch: fetchConversations
  };
};
