
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    console.log("Starting RSVP reminder check...");

    // Get events happening in the next 24-48 hours that need reminders
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    const { data: upcomingEvents, error: eventsError } = await supabaseClient
      .from('events')
      .select('*')
      .gte('date', now.toISOString().split('T')[0])
      .lte('date', in48Hours.toISOString().split('T')[0]);

    if (eventsError) {
      console.error('Error fetching upcoming events:', eventsError);
      throw eventsError;
    }

    console.log(`Found ${upcomingEvents?.length || 0} upcoming events`);

    for (const event of upcomingEvents || []) {
      const eventDate = new Date(`${event.date}T${event.time}`);
      const timeUntilEvent = eventDate.getTime() - now.getTime();
      const hoursUntilEvent = timeUntilEvent / (1000 * 60 * 60);

      console.log(`Event ${event.title} is in ${hoursUntilEvent.toFixed(1)} hours`);

      // Determine reminder type based on time until event
      let reminderType = '';
      if (hoursUntilEvent <= 1 && hoursUntilEvent > 0) {
        reminderType = '1h';
      } else if (hoursUntilEvent <= 24 && hoursUntilEvent > 1) {
        reminderType = '24h';
      } else if (hoursUntilEvent <= 48 && hoursUntilEvent > 24) {
        reminderType = 'initial';
      }

      if (!reminderType) continue;

      // Get users who haven't responded yet (response is 'pending')
      const { data: pendingRSVPs, error: rsvpError } = await supabaseClient
        .from('event_rsvps')
        .select(`
          *,
          user_profiles!inner(email, display_name)
        `)
        .eq('event_id', event.id)
        .eq('response', 'pending');

      if (rsvpError) {
        console.error('Error fetching pending RSVPs:', rsvpError);
        continue;
      }

      // Get players who haven't responded yet
      const { data: pendingPlayerRSVPs, error: playerRsvpError } = await supabaseClient
        .from('player_event_rsvps')
        .select(`
          *,
          players!inner(name, guardian_email)
        `)
        .eq('event_id', event.id)
        .eq('response', 'pending');

      if (playerRsvpError) {
        console.error('Error fetching pending player RSVPs:', playerRsvpError);
        continue;
      }

      console.log(`Found ${pendingRSVPs?.length || 0} pending user RSVPs and ${pendingPlayerRSVPs?.length || 0} pending player RSVPs`);

      // Send reminders for user RSVPs
      for (const rsvp of pendingRSVPs || []) {
        // Check if reminder was already sent
        const { data: existingReminder } = await supabaseClient
          .from('rsvp_reminders')
          .select('id')
          .eq('event_id', event.id)
          .eq('user_id', rsvp.user_id)
          .eq('reminder_type', reminderType)
          .single();

        if (existingReminder) {
          console.log(`Reminder already sent for user ${rsvp.user_id}, event ${event.id}, type ${reminderType}`);
          continue;
        }

        // Send email reminder
        try {
          await supabaseClient.functions.invoke('send-event-notification', {
            body: {
              eventId: event.id,
              eventTitle: event.title,
              eventDate: event.date,
              eventTime: event.time,
              eventLocation: event.location,
              recipientEmail: rsvp.user_profiles.email,
              recipientName: rsvp.user_profiles.display_name,
              reminderType: reminderType
            }
          });

          // Record that reminder was sent
          await supabaseClient
            .from('rsvp_reminders')
            .insert({
              event_id: event.id,
              user_id: rsvp.user_id,
              reminder_type: reminderType
            });

          console.log(`Sent ${reminderType} reminder to ${rsvp.user_profiles.email} for event ${event.title}`);
        } catch (emailError) {
          console.error(`Failed to send reminder to ${rsvp.user_profiles.email}:`, emailError);
        }
      }

      // Send reminders for player RSVPs (to guardians)
      const guardianEmails = new Set();
      for (const rsvp of pendingPlayerRSVPs || []) {
        const guardianEmail = rsvp.players.guardian_email;
        if (!guardianEmail || guardianEmails.has(guardianEmail)) continue;

        guardianEmails.add(guardianEmail);

        // Check if reminder was already sent for this player
        const { data: existingReminder } = await supabaseClient
          .from('rsvp_reminders')
          .select('id')
          .eq('event_id', event.id)
          .eq('player_id', rsvp.player_id)
          .eq('reminder_type', reminderType)
          .single();

        if (existingReminder) {
          console.log(`Reminder already sent for player ${rsvp.player_id}, event ${event.id}, type ${reminderType}`);
          continue;
        }

        // Send email reminder to guardian
        try {
          await supabaseClient.functions.invoke('send-event-notification', {
            body: {
              eventId: event.id,
              eventTitle: event.title,
              eventDate: event.date,
              eventTime: event.time,
              eventLocation: event.location,
              recipientEmail: guardianEmail,
              recipientName: 'Guardian',
              playerName: rsvp.players.name,
              reminderType: reminderType
            }
          });

          // Record that reminder was sent
          await supabaseClient
            .from('rsvp_reminders')
            .insert({
              event_id: event.id,
              player_id: rsvp.player_id,
              reminder_type: reminderType
            });

          console.log(`Sent ${reminderType} reminder to ${guardianEmail} for player ${rsvp.players.name}, event ${event.title}`);
        } catch (emailError) {
          console.error(`Failed to send reminder to ${guardianEmail}:`, emailError);
        }
      }
    }

    console.log("RSVP reminder check completed");

    return new Response(JSON.stringify({ 
      message: "RSVP reminders processed successfully",
      eventsProcessed: upcomingEvents?.length || 0
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-rsvp-reminders function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
