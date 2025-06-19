
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextOptimized';
import { HuddlePost } from '@/types/huddleTypes';

export const useAnnouncements = (teamId?: string | null) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<HuddlePost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('huddle_announcements')
        .select('*')
        .order('created_at', { ascending: false });

      // If teamId is provided, filter by team, otherwise get all posts
      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching announcements:', error);
        return;
      }

      const transformedPosts: HuddlePost[] = data?.map(post => ({
        id: post.id,
        user_id: post.user_id,
        author_name: post.author_name,
        title: post.title,
        content: post.content,
        allow_comments: post.allow_comments,
        team_id: post.team_id,
        likes: post.likes || 0,
        liked_by: post.liked_by || [],
        created_at: post.created_at,
        updated_at: post.updated_at,
        comments: [], // Comments would need to be fetched separately
        visibility: 'all',
      })) || [];

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error in fetchAnnouncements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [teamId]); // Re-fetch when teamId changes

  const createAnnouncement = async (
    title: string, 
    content: string, 
    allowComments: boolean, 
    authorName: string, 
    postTeamId?: string
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('huddle_announcements')
        .insert({
          user_id: user.id,
          author_name: authorName,
          title,
          content,
          allow_comments: allowComments,
          team_id: postTeamId || teamId || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating announcement:', error);
        return;
      }

      // Refresh the posts
      fetchAnnouncements();
    } catch (error) {
      console.error('Error in createAnnouncement:', error);
    }
  };

  const deleteAnnouncement = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('huddle_announcements')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error('Error deleting announcement:', error);
        return;
      }

      // Remove from local state
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error in deleteAnnouncement:', error);
    }
  };

  const likeAnnouncement = async (postId: string) => {
    if (!user) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const isLiked = post.liked_by.includes(user.id);
      const newLikedBy = isLiked
        ? post.liked_by.filter(id => id !== user.id)
        : [...post.liked_by, user.id];

      const { error } = await supabase
        .from('huddle_announcements')
        .update({
          likes: newLikedBy.length,
          liked_by: newLikedBy,
        })
        .eq('id', postId);

      if (error) {
        console.error('Error updating likes:', error);
        return;
      }

      // Update local state
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, likes: newLikedBy.length, liked_by: newLikedBy }
          : p
      ));
    } catch (error) {
      console.error('Error in likeAnnouncement:', error);
    }
  };

  const updateAnnouncement = async (postId: string, updates: Partial<HuddlePost>) => {
    try {
      const { error } = await supabase
        .from('huddle_announcements')
        .update(updates)
        .eq('id', postId);

      if (error) {
        console.error('Error updating announcement:', error);
        return;
      }

      // Refresh the posts
      fetchAnnouncements();
    } catch (error) {
      console.error('Error in updateAnnouncement:', error);
    }
  };

  return {
    posts,
    loading,
    createAnnouncement,
    deleteAnnouncement,
    likeAnnouncement,
    updateAnnouncement,
    refetch: fetchAnnouncements,
  };
};
