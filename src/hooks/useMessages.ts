
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { Message } from './useConversations';

export const useMessages = (conversationId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const sendMessage = async (content: string): Promise<boolean> => {
    if (!conversationId || !user?.id || !content.trim()) return false;

    try {
      const { data: messageData, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim()
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation's updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      // Get conversation details to find recipient
      const { data: conversationData, error: convError } = await supabase
        .from('conversations')
        .select('participant_1_id, participant_2_id')
        .eq('id', conversationId)
        .single();

      if (convError) {
        console.error('Error fetching conversation:', convError);
        return true; // Don't fail message sending if notification fails
      }

      if (conversationData) {
        // Determine the recipient (the other participant)
        const recipientId = conversationData.participant_1_id === user.id 
          ? conversationData.participant_2_id 
          : conversationData.participant_1_id;
        
        if (recipientId && recipientId !== user.id) {
          // Get recipient's profile information
          const { data: recipientProfile, error: profileError } = await supabase
            .from('user_profiles')
            .select('email, display_name')
            .eq('id', recipientId)
            .single();

          if (!profileError && recipientProfile?.email) {
            // Get sender's display name
            const { data: senderProfile } = await supabase
              .from('user_profiles')
              .select('display_name')
              .eq('id', user.id)
              .single();

            const senderName = senderProfile?.display_name || user.email || 'A team member';

            // Send notification email
            try {
              await supabase.functions.invoke('send-message-notification', {
                body: {
                  messageId: messageData.id,
                  recipientId: recipientId,
                  recipientEmail: recipientProfile.email,
                  senderName: senderName,
                  messageContent: content.trim(),
                  conversationId: conversationId
                }
              });
            } catch (emailError) {
              console.error('Error sending message notification:', emailError);
              // Don't fail the message sending if email notification fails
            }
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  // Set up real-time subscription for messages
  useEffect(() => {
    if (!conversationId) return;

    fetchMessages();

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages]);

  return {
    messages,
    loading,
    sendMessage,
    refetch: fetchMessages
  };
};
