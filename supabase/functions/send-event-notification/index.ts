
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request body
    const { 
      eventId, 
      teamId, 
      eventTitle, 
      eventDate, 
      eventTime, 
      eventLocation, 
      eventType,
      duration,
      matchupFormat,
      opponent 
    } = await req.json();
    
    console.log(`Sending event notifications for event ${eventId} to team ${teamId}`);
    
    // Get team members and their contact information
    const { data: teamMembers, error: membersError } = await supabase
      .from('team_members')
      .select(`
        user_id,
        user_profiles!inner(email, display_name)
      `)
      .eq('team_id', teamId);

    if (membersError) {
      console.error('Error fetching team members:', membersError);
      throw membersError;
    }

    // Get team coaches
    const { data: teamCoaches, error: coachesError } = await supabase
      .from('team_coaches')
      .select('email, name')
      .eq('team_id', teamId)
      .not('email', 'is', null);

    if (coachesError) {
      console.error('Error fetching team coaches:', coachesError);
    }

    // Get players and their guardian emails
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('guardian_email, guardian_name, name')
      .eq('team_id', teamId)
      .not('guardian_email', 'is', null);

    if (playersError) {
      console.error('Error fetching players:', playersError);
    }

    // Get the base URL for the RSVP link
    const baseUrl = req.headers.get('origin') || 'https://your-app.lovable.app';
    const rsvpLink = `${baseUrl}/event/${eventId}`;
    
    // Format date and time
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);
    const formattedDate = eventDateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = eventDateTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Build event details
    let eventDetails = `📅 ${formattedDate} at ${formattedTime}\n📍 ${eventLocation}`;
    
    if (eventType === 'Game') {
      if (opponent) eventDetails += `\n🏈 vs ${opponent}`;
      if (duration) eventDetails += `\n⏱️ ${duration} minutes`;
      if (matchupFormat) eventDetails += `\n🎯 ${matchupFormat} format`;
    }

    // Create the email HTML template
    const createEmailHtml = (recipientName: string, isParent: boolean = false) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New ${eventType}: ${eventTitle} - BlitzBoard Stats</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #1a1a1a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #2a2a2a; border-radius: 8px; overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #10B981 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🏈 New ${eventType}</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">BlitzBoard Stats Team Schedule</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 24px;">${eventTitle}</h2>
                <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hi ${recipientName},</p>
                <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">A new ${eventType.toLowerCase()} has been scheduled for the team.</p>
                
                <!-- Event Details -->
                <div style="background-color: #1f2937; border-left: 4px solid #8B5CF6; padding: 20px; margin: 20px 0; border-radius: 4px;">
                    <h3 style="color: #10B981; margin: 0 0 15px 0; font-size: 18px;">Event Details</h3>
                    <div style="color: #e5e7eb; font-size: 16px; line-height: 1.8;">
                        <div>📅 <strong>${formattedDate}</strong></div>
                        <div>🕐 <strong>${formattedTime}</strong></div>
                        <div>📍 <strong>${eventLocation}</strong></div>
                        ${eventType === 'Game' && opponent ? `<div>🏈 <strong>vs ${opponent}</strong></div>` : ''}
                        ${eventType === 'Game' && duration ? `<div>⏱️ <strong>${duration} minutes</strong></div>` : ''}
                        ${eventType === 'Game' && matchupFormat ? `<div>🎯 <strong>${matchupFormat} format</strong></div>` : ''}
                    </div>
                </div>
                
                <!-- RSVP Section -->
                <div style="background-color: #374151; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #10B981; margin: 0 0 15px 0; font-size: 18px;">Please RSVP</h3>
                    <p style="color: #d1d5db; margin: 0 0 20px 0;">Let us know if you can attend:</p>
                    
                    <div style="text-align: center;">
                        <a href="${rsvpLink}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #10B981 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 0 10px 10px 0;">
                            View Event & RSVP
                        </a>
                    </div>
                    
                    <p style="color: #9ca3af; font-size: 14px; margin: 15px 0 0 0; text-align: center;">
                        Click above to choose: I'm In • Not Available • Pending
                    </p>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 20px 0; text-align: center;">
                    Stay connected with your team through BlitzBoard Stats.
                </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #111827; padding: 20px 30px; text-align: center;">
                <p style="color: #6b7280; margin: 0; font-size: 14px;">
                    BlitzBoard Stats - Keeping Teams Connected<br>
                    This ${eventType.toLowerCase()} notification was sent from your team's communication system.
                </p>
                <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 12px;">
                    Don't want to receive event notifications? <a href="mailto:unsubscribe@mg.blitzboardstats.com?subject=Unsubscribe%20Request&body=Please%20unsubscribe%20me%20from%20event%20notifications." style="color: #8B5CF6; text-decoration: underline;">Unsubscribe here</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    // Create plain text version
    const createEmailText = (recipientName: string) => `New ${eventType}: ${eventTitle} - BlitzBoard Stats

Hi ${recipientName},

A new ${eventType.toLowerCase()} has been scheduled for the team.

Event Details:
${eventDetails}

Please RSVP by visiting: ${rsvpLink}

Choose from: I'm In • Not Available • Pending

Stay connected with your team through BlitzBoard Stats.

---

BlitzBoard Stats - Keeping Teams Connected
This ${eventType.toLowerCase()} notification was sent from your team's communication system.

To unsubscribe from event notifications, reply to this email with "UNSUBSCRIBE" in the subject line.
    `;

    const emailPromises = [];

    // Send to team members
    if (teamMembers && teamMembers.length > 0) {
      for (const member of teamMembers) {
        if (member.user_profiles?.email) {
          const form = new FormData();
          form.append("from", `BlitzBoard Stats Team <events@mg.blitzboardstats.com>`);
          form.append("to", member.user_profiles.email);
          form.append("subject", `🏈 New ${eventType}: ${eventTitle}`);
          form.append("text", createEmailText(member.user_profiles.display_name || 'Team Member'));
          form.append("html", createEmailHtml(member.user_profiles.display_name || 'Team Member', false));
          
          emailPromises.push(
            fetch("https://api.mailgun.net/v3/mg.blitzboardstats.com/messages", {
              method: "POST",
              headers: {
                Authorization: "Basic " + btoa(`api:${Deno.env.get("MAILGUN_KEY")}`)
              },
              body: form
            })
          );
        }
      }
    }

    // Send to coaches (who might not be team members)
    if (teamCoaches && teamCoaches.length > 0) {
      for (const coach of teamCoaches) {
        if (coach.email) {
          const form = new FormData();
          form.append("from", `BlitzBoard Stats Team <events@mg.blitzboardstats.com>`);
          form.append("to", coach.email);
          form.append("subject", `🏈 New ${eventType}: ${eventTitle}`);
          form.append("text", createEmailText(coach.name || 'Coach'));
          form.append("html", createEmailHtml(coach.name || 'Coach', false));
          
          emailPromises.push(
            fetch("https://api.mailgun.net/v3/mg.blitzboardstats.com/messages", {
              method: "POST",
              headers: {
                Authorization: "Basic " + btoa(`api:${Deno.env.get("MAILGUN_KEY")}`)
              },
              body: form
            })
          );
        }
      }
    }

    // Send to player guardians
    if (players && players.length > 0) {
      for (const player of players) {
        if (player.guardian_email) {
          const guardianName = player.guardian_name || `${player.name}'s Guardian`;
          
          const form = new FormData();
          form.append("from", `BlitzBoard Stats Team <events@mg.blitzboardstats.com>`);
          form.append("to", player.guardian_email);
          form.append("subject", `🏈 New ${eventType}: ${eventTitle} (${player.name})`);
          form.append("text", createEmailText(guardianName));
          form.append("html", createEmailHtml(guardianName, true));
          
          emailPromises.push(
            fetch("https://api.mailgun.net/v3/mg.blitzboardstats.com/messages", {
              method: "POST",
              headers: {
                Authorization: "Basic " + btoa(`api:${Deno.env.get("MAILGUN_KEY")}`)
              },
              body: form
            })
          );
        }
      }
    }

    // Send all emails
    const results = await Promise.allSettled(emailPromises);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.ok) {
        successCount++;
      } else {
        errorCount++;
        if (result.status === 'rejected') {
          console.error('Email send error:', result.reason);
        } else {
          console.error('Email send failed:', await result.value.text());
        }
      }
    }
    
    console.log(`Event notifications sent: ${successCount} successful, ${errorCount} failed`);
    
    return new Response(
      JSON.stringify({ 
        message: "Event notifications sent", 
        successful: successCount, 
        failed: errorCount 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
    
  } catch (error) {
    console.error('Error in send-event-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
});
