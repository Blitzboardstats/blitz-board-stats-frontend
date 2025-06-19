export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      conversations: {
        Row: {
          created_at: string
          id: string
          participant_1_id: string
          participant_2_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          participant_1_id: string
          participant_2_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          participant_1_id?: string
          participant_2_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          id: string
          notes: string | null
          response: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          notes?: string | null
          response: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          notes?: string | null
          response?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_teams: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          team_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          team_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_teams_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_teams_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          age_groups: string[] | null
          created_at: string
          created_by: string
          date: string
          duration: number | null
          end_time: string | null
          id: string
          location: string
          matchup_format: string | null
          notes: string | null
          opponent: string | null
          team_count: number | null
          team_id: string
          time: string
          title: string
          type: Database["public"]["Enums"]["event_type"]
          updated_at: string
        }
        Insert: {
          age_groups?: string[] | null
          created_at?: string
          created_by: string
          date: string
          duration?: number | null
          end_time?: string | null
          id?: string
          location: string
          matchup_format?: string | null
          notes?: string | null
          opponent?: string | null
          team_count?: number | null
          team_id: string
          time: string
          title: string
          type: Database["public"]["Enums"]["event_type"]
          updated_at?: string
        }
        Update: {
          age_groups?: string[] | null
          created_at?: string
          created_by?: string
          date?: string
          duration?: number | null
          end_time?: string | null
          id?: string
          location?: string
          matchup_format?: string | null
          notes?: string | null
          opponent?: string | null
          team_count?: number | null
          team_id?: string
          time?: string
          title?: string
          type?: Database["public"]["Enums"]["event_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          created_at: string
          created_by: string
          current_quarter: number
          end_time: string | null
          event_id: string
          id: string
          is_active: boolean
          start_time: string
          team_id: string
          team_side: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          current_quarter?: number
          end_time?: string | null
          event_id: string
          id?: string
          is_active?: boolean
          start_time?: string
          team_id: string
          team_side: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          current_quarter?: number
          end_time?: string | null
          event_id?: string
          id?: string
          is_active?: boolean
          start_time?: string
          team_id?: string
          team_side?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_sessions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      game_stats: {
        Row: {
          created_at: string
          def_interceptions: number
          extra_point_1: number
          extra_point_2: number
          flag_pulls: number
          game_date: string
          game_session_id: string | null
          id: string
          opponent: string | null
          pick_6: number
          player_id: string
          player_td_points: number
          qb_completions: number
          qb_interceptions: number
          qb_td_points: number
          qb_touchdowns: number
          quarter: number
          receptions: number
          runs: number
          safeties: number
          team_id: string
          total_points: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          def_interceptions?: number
          extra_point_1?: number
          extra_point_2?: number
          flag_pulls?: number
          game_date: string
          game_session_id?: string | null
          id?: string
          opponent?: string | null
          pick_6?: number
          player_id: string
          player_td_points?: number
          qb_completions?: number
          qb_interceptions?: number
          qb_td_points?: number
          qb_touchdowns?: number
          quarter: number
          receptions?: number
          runs?: number
          safeties?: number
          team_id: string
          total_points?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          def_interceptions?: number
          extra_point_1?: number
          extra_point_2?: number
          flag_pulls?: number
          game_date?: string
          game_session_id?: string | null
          id?: string
          opponent?: string | null
          pick_6?: number
          player_id?: string
          player_td_points?: number
          qb_completions?: number
          qb_interceptions?: number
          qb_td_points?: number
          qb_touchdowns?: number
          quarter?: number
          receptions?: number
          runs?: number
          safeties?: number
          team_id?: string
          total_points?: number
          updated_at?: string
        }
        Relationships: []
      }
      huddle_announcements: {
        Row: {
          allow_comments: boolean
          author_name: string
          content: string
          created_at: string
          id: string
          liked_by: string[] | null
          likes: number
          team_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          allow_comments?: boolean
          author_name: string
          content: string
          created_at?: string
          id?: string
          liked_by?: string[] | null
          likes?: number
          team_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          allow_comments?: boolean
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          liked_by?: string[] | null
          likes?: number
          team_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      huddle_comments: {
        Row: {
          announcement_id: string
          author_name: string
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          announcement_id: string
          author_name: string
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          announcement_id?: string
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "huddle_comments_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "huddle_announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      individual_games: {
        Row: {
          created_at: string
          created_by: string
          final_score_away: number | null
          final_score_home: number | null
          game_date: string
          game_session_id: string | null
          game_type: string | null
          id: string
          is_home_game: boolean | null
          notes: string | null
          opponent: string
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          final_score_away?: number | null
          final_score_home?: number | null
          game_date: string
          game_session_id?: string | null
          game_type?: string | null
          id?: string
          is_home_game?: boolean | null
          notes?: string | null
          opponent: string
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          final_score_away?: number | null
          final_score_home?: number | null
          game_date?: string
          game_session_id?: string | null
          game_type?: string | null
          id?: string
          is_home_game?: boolean | null
          notes?: string | null
          opponent?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      live_stat_actions: {
        Row: {
          action_type: string
          created_at: string
          game_session_id: string
          id: string
          player_id: string
          points: number | null
          quarter: number
          side: string
          timestamp: string
        }
        Insert: {
          action_type: string
          created_at?: string
          game_session_id: string
          id?: string
          player_id: string
          points?: number | null
          quarter: number
          side: string
          timestamp?: string
        }
        Update: {
          action_type?: string
          created_at?: string
          game_session_id?: string
          id?: string
          player_id?: string
          points?: number | null
          quarter?: number
          side?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_stat_actions_game_session_id_fkey"
            columns: ["game_session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_stat_actions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      player_combinations: {
        Row: {
          attempts: number
          completions: number
          created_at: string
          game_session_id: string | null
          id: string
          qb_player_id: string
          quarter: number
          receiver_player_id: string | null
          success_rate: number | null
          team_id: string
          touchdowns: number
          updated_at: string
          yards: number
        }
        Insert: {
          attempts?: number
          completions?: number
          created_at?: string
          game_session_id?: string | null
          id?: string
          qb_player_id: string
          quarter: number
          receiver_player_id?: string | null
          success_rate?: number | null
          team_id: string
          touchdowns?: number
          updated_at?: string
          yards?: number
        }
        Update: {
          attempts?: number
          completions?: number
          created_at?: string
          game_session_id?: string | null
          id?: string
          qb_player_id?: string
          quarter?: number
          receiver_player_id?: string | null
          success_rate?: number | null
          team_id?: string
          touchdowns?: number
          updated_at?: string
          yards?: number
        }
        Relationships: []
      }
      player_event_rsvps: {
        Row: {
          created_at: string
          event_id: string
          id: string
          notes: string | null
          player_id: string
          response: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          notes?: string | null
          player_id: string
          response: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          notes?: string | null
          player_id?: string
          response?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_event_rsvps_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_guardians: {
        Row: {
          can_edit: boolean
          can_view_stats: boolean
          created_at: string
          guardian_user_id: string
          id: string
          player_id: string
          relationship_type: string
          updated_at: string
        }
        Insert: {
          can_edit?: boolean
          can_view_stats?: boolean
          created_at?: string
          guardian_user_id: string
          id?: string
          player_id: string
          relationship_type?: string
          updated_at?: string
        }
        Update: {
          can_edit?: boolean
          can_view_stats?: boolean
          created_at?: string
          guardian_user_id?: string
          id?: string
          player_id?: string
          relationship_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_player_guardians_guardian_user_id"
            columns: ["guardian_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_player_guardians_player_id"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_guardians_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_season_stats: {
        Row: {
          created_at: string
          def_interceptions: number
          extra_point_1: number
          extra_point_2: number
          flag_pulls: number
          games_played: number
          id: string
          pick_6: number
          player_id: string
          player_td_points: number
          qb_completions: number
          qb_td_points: number
          qb_touchdowns: number
          receptions: number
          runs: number
          safeties: number
          season: string
          team_id: string
          total_points: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          def_interceptions?: number
          extra_point_1?: number
          extra_point_2?: number
          flag_pulls?: number
          games_played?: number
          id?: string
          pick_6?: number
          player_id: string
          player_td_points?: number
          qb_completions?: number
          qb_td_points?: number
          qb_touchdowns?: number
          receptions?: number
          runs?: number
          safeties?: number
          season?: string
          team_id: string
          total_points?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          def_interceptions?: number
          extra_point_1?: number
          extra_point_2?: number
          flag_pulls?: number
          games_played?: number
          id?: string
          pick_6?: number
          player_id?: string
          player_td_points?: number
          qb_completions?: number
          qb_td_points?: number
          qb_touchdowns?: number
          receptions?: number
          runs?: number
          safeties?: number
          season?: string
          team_id?: string
          total_points?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_season_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_season_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      player_stats: {
        Row: {
          catches: number | null
          created_at: string
          games_played: number | null
          id: string
          player_id: string
          tackles: number | null
          touchdowns: number | null
          updated_at: string
          yards: number | null
        }
        Insert: {
          catches?: number | null
          created_at?: string
          games_played?: number | null
          id?: string
          player_id: string
          tackles?: number | null
          touchdowns?: number | null
          updated_at?: string
          yards?: number | null
        }
        Update: {
          catches?: number | null
          created_at?: string
          games_played?: number | null
          id?: string
          player_id?: string
          tackles?: number | null
          touchdowns?: number | null
          updated_at?: string
          yards?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      player_team_relationships: {
        Row: {
          created_at: string
          id: string
          joined_at: string
          left_at: string | null
          player_id: string
          status: string
          team_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          joined_at?: string
          left_at?: string | null
          player_id: string
          status?: string
          team_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          joined_at?: string
          left_at?: string | null
          player_id?: string
          status?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_team_relationships_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_team_relationships_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          created_at: string
          graduation_year: number | null
          guardian_email: string | null
          guardian_name: string | null
          id: string
          jersey_number: string | null
          name: string
          photo_url: string | null
          position: string | null
          recruit_profile: string | null
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          graduation_year?: number | null
          guardian_email?: string | null
          guardian_name?: string | null
          id?: string
          jersey_number?: string | null
          name: string
          photo_url?: string | null
          position?: string | null
          recruit_profile?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          graduation_year?: number | null
          guardian_email?: string | null
          guardian_name?: string | null
          id?: string
          jersey_number?: string | null
          name?: string
          photo_url?: string | null
          position?: string | null
          recruit_profile?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quarter_rosters: {
        Row: {
          created_at: string
          game_session_id: string
          id: string
          is_active: boolean
          player_id: string
          quarter: number
        }
        Insert: {
          created_at?: string
          game_session_id: string
          id?: string
          is_active?: boolean
          player_id: string
          quarter: number
        }
        Update: {
          created_at?: string
          game_session_id?: string
          id?: string
          is_active?: boolean
          player_id?: string
          quarter?: number
        }
        Relationships: [
          {
            foreignKeyName: "quarter_rosters_game_session_id_fkey"
            columns: ["game_session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quarter_rosters_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          can_create_teams: boolean | null
          can_follow_teams: boolean | null
          can_join_teams: boolean | null
          can_manage_players: boolean | null
          can_manage_schedule: boolean | null
          can_manage_stats: boolean | null
          can_manage_teams: boolean | null
          can_use_referee_tools: boolean | null
          can_view_players: boolean | null
          can_view_schedule: boolean | null
          can_view_stats: boolean | null
          can_view_teams: boolean | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          can_create_teams?: boolean | null
          can_follow_teams?: boolean | null
          can_join_teams?: boolean | null
          can_manage_players?: boolean | null
          can_manage_schedule?: boolean | null
          can_manage_stats?: boolean | null
          can_manage_teams?: boolean | null
          can_use_referee_tools?: boolean | null
          can_view_players?: boolean | null
          can_view_schedule?: boolean | null
          can_view_stats?: boolean | null
          can_view_teams?: boolean | null
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          can_create_teams?: boolean | null
          can_follow_teams?: boolean | null
          can_join_teams?: boolean | null
          can_manage_players?: boolean | null
          can_manage_schedule?: boolean | null
          can_manage_stats?: boolean | null
          can_manage_teams?: boolean | null
          can_use_referee_tools?: boolean | null
          can_view_players?: boolean | null
          can_view_schedule?: boolean | null
          can_view_stats?: boolean | null
          can_view_teams?: boolean | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      rsvp_reminders: {
        Row: {
          created_at: string
          event_id: string
          id: string
          player_id: string | null
          reminder_type: string
          sent_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          player_id?: string | null
          reminder_type: string
          sent_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          player_id?: string | null
          reminder_type?: string
          sent_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rsvp_reminders_event_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      team_coaches: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_head_coach: boolean | null
          name: string
          phone: string | null
          role: string
          team_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_head_coach?: boolean | null
          name: string
          phone?: string | null
          role: string
          team_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_head_coach?: boolean | null
          name?: string
          phone?: string | null
          role?: string
          team_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_coaches_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          coach_role: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invitation_type: string
          invited_by: string
          player_name: string | null
          status: string
          team_id: string
          updated_at: string
        }
        Insert: {
          coach_role?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invitation_type?: string
          invited_by: string
          player_name?: string | null
          status?: string
          team_id: string
          updated_at?: string
        }
        Update: {
          coach_role?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invitation_type?: string
          invited_by?: string
          player_name?: string | null
          status?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_join_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          guardian_email: string
          guardian_user_id: string
          id: string
          message: string | null
          player_jersey_number: string | null
          player_name: string
          status: string
          team_id: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          guardian_email: string
          guardian_user_id: string
          id?: string
          message?: string | null
          player_jersey_number?: string | null
          player_name: string
          status?: string
          team_id: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          guardian_email?: string
          guardian_user_id?: string
          id?: string
          message?: string | null
          player_jersey_number?: string | null
          player_name?: string
          status?: string
          team_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_join_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "team_coaches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_join_requests_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_team_members_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          age_group: string | null
          coach_id: string
          created_at: string
          created_by: string
          draws: number | null
          football_type: string
          id: string
          is_active: boolean | null
          logo_url: string | null
          losses: number | null
          name: string
          photo_url: string | null
          primary_color: string | null
          season: string | null
          secondary_color: string | null
          wins: number | null
        }
        Insert: {
          age_group?: string | null
          coach_id: string
          created_at?: string
          created_by: string
          draws?: number | null
          football_type: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          losses?: number | null
          name: string
          photo_url?: string | null
          primary_color?: string | null
          season?: string | null
          secondary_color?: string | null
          wins?: number | null
        }
        Update: {
          age_group?: string | null
          coach_id?: string
          created_at?: string
          created_by?: string
          draws?: number | null
          football_type?: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          losses?: number | null
          name?: string
          photo_url?: string | null
          primary_color?: string | null
          season?: string | null
          secondary_color?: string | null
          wins?: number | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          guardian_email: string | null
          id: string
          joined_teams: string[] | null
          onboarding_completed: boolean | null
          onboarding_step: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          guardian_email?: string | null
          id: string
          joined_teams?: string[] | null
          onboarding_completed?: boolean | null
          onboarding_step?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          guardian_email?: string | null
          id?: string
          joined_teams?: string[] | null
          onboarding_completed?: boolean | null
          onboarding_step?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_view_player_stats: {
        Args: { player_id_param: string; user_id_param: string }
        Returns: boolean
      }
      get_user_permissions: {
        Args: { user_id: string }
        Returns: {
          user_role_result: Database["public"]["Enums"]["user_role"]
          can_create_teams: boolean
          can_manage_teams: boolean
          can_view_teams: boolean
          can_join_teams: boolean
          can_manage_players: boolean
          can_view_players: boolean
          can_manage_stats: boolean
          can_view_stats: boolean
          can_manage_schedule: boolean
          can_view_schedule: boolean
          can_use_referee_tools: boolean
          can_follow_teams: boolean
        }[]
      }
      is_player_guardian: {
        Args: { player_id_param: string; user_id_param: string }
        Returns: boolean
      }
      is_team_member: {
        Args: { team_id_param: string; user_id_param: string }
        Returns: boolean
      }
      migrate_existing_players_to_user_relationships: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      populate_missing_player_rsvps: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      user_can_access_team: {
        Args: { team_id_param: string; user_id_param: string }
        Returns: boolean
      }
      user_can_manage_team: {
        Args: { team_id_param: string; user_id_param: string }
        Returns: boolean
      }
      user_can_view_player: {
        Args: { player_id_param: string; user_id_param: string }
        Returns: boolean
      }
      user_can_view_team_coaches: {
        Args: { team_id_param: string; user_id_param: string }
        Returns: boolean
      }
      user_can_view_team_members: {
        Args: { team_id_param: string; user_id_param: string }
        Returns: boolean
      }
      user_has_team_access: {
        Args: { team_id_param: string; user_id_param: string }
        Returns: boolean
      }
    }
    Enums: {
      event_type: "Game" | "Practice" | "Tournament"
      user_role: "coach" | "parent" | "player" | "fan" | "referee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      event_type: ["Game", "Practice", "Tournament"],
      user_role: ["coach", "parent", "player", "fan", "referee"],
    },
  },
} as const
