
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting user:', userError);
      return new Response(
        JSON.stringify({ 
          error: 'Authentication required',
          code: 'AUTH_REQUIRED',
          details: userError?.message || 'No authenticated user found'
        }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Parse request body
    const { to, teamName, teamType, inviterName, invitationType, teamId, playerName, coachRole } = await req.json();
    
    console.log('Edge function called with invitation details:', {
      to,
      teamName,
      teamType,
      invitationType,
      teamId,
      playerName,
      coachRole,
      inviterUserId: user.id,
      inviterEmail: user.email
    });

    // Validate required fields
    if (!to || !teamName || !teamType || !invitationType || !teamId) {
      console.error('Missing required fields for invitation');
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          code: 'MISSING_FIELDS',
          details: 'to, teamName, teamType, invitationType, and teamId are required'
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }
    
    // Fetch additional team details including age group
    let teamAgeGroup = null;
    let teamSeason = null;
    if (teamId) {
      console.log('Fetching team details for:', teamId);
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('age_group, season')
        .eq('id', teamId)
        .single();
      
      if (!teamError && teamData) {
        teamAgeGroup = teamData.age_group;
        teamSeason = teamData.season;
        console.log('Team details fetched successfully:', { teamAgeGroup, teamSeason });
      } else {
        console.warn('Could not fetch team details:', teamError?.message);
      }
    }
    
    // Log the invitation activity
    console.log(`Invitation email request by user ${user.id} (${user.email}) to: ${to}`);
    console.log(`Team: ${teamName} (${teamType})`);
    console.log(`Age Group: ${teamAgeGroup}, Season: ${teamSeason}`);
    console.log(`Invitation type: ${invitationType}`);
    if (playerName) console.log(`Player name: ${playerName}`);
    if (coachRole) console.log(`Coach role: ${coachRole}`);
    
    // Check if invitation already exists (to prevent duplicates from edge function)
    console.log('Checking for existing invitation...');
    const { data: existingInvitation, error: checkError } = await supabase
      .from('team_invitations')
      .select('id, status')
      .eq('team_id', teamId)
      .eq('email', to.toLowerCase())
      .eq('invitation_type', invitationType)
      .eq('status', 'pending')
      .maybeSingle();

    if (checkError) {
      console.error('Error checking for existing invitation:', checkError);
      return new Response(
        JSON.stringify({ 
          error: 'Database error while checking existing invitations',
          code: 'DB_CHECK_ERROR',
          details: checkError.message
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    if (existingInvitation) {
      console.log('Existing invitation found, skipping database creation:', existingInvitation.id);
    } else {
      // Create invitation record in database only if it doesn't exist
      console.log('Creating new invitation record in database...');
      const { error: invitationError } = await supabase
        .from('team_invitations')
        .insert({
          team_id: teamId,
          email: to.toLowerCase(),
          invited_by: user.id,
          invitation_type: invitationType,
          player_name: playerName,
          coach_role: coachRole
        });
      
      if (invitationError) {
        console.error('Error creating invitation record:', invitationError);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to create invitation record',
            code: 'DB_INSERT_ERROR',
            details: invitationError.message,
            hint: invitationError.hint || 'Check database permissions and constraints'
          }),
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        );
      } else {
        console.log('Invitation record created successfully in database');
      }
    }
    
    // Check Mailgun API key
    const mailgunKey = Deno.env.get("MAILGUN_KEY");
    if (!mailgunKey) {
      console.error('MAILGUN_KEY environment variable is not set');
      return new Response(
        JSON.stringify({ 
          error: 'Email service not configured',
          code: 'EMAIL_CONFIG_ERROR',
          details: 'MAILGUN_KEY environment variable is missing'
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }
    
    // Get the base URL for the CTA button and logo
    const baseUrl = req.headers.get('origin') || 'https://your-app.lovable.app';
    const logoUrl = `${baseUrl}/lovable-uploads/8225b3cc-b640-4df3-9fdc-581d216e165b.png`;
    
    // Create a smart redirect URL that checks authentication status
    const smartRedirectUrl = `${baseUrl}/auth-redirect?email=${encodeURIComponent(to)}&action=join-team`;
    
    // Create enhanced role display
    let roleDisplay = 'Team Member';
    if (invitationType === 'coach') {
      roleDisplay = `Coach - ${coachRole || 'Assistant Coach'}`;
    } else if (invitationType === 'player') {
      roleDisplay = `Player - ${playerName}`;
    }
    
    // Create division display
    const divisionDisplay = teamType || 'Football';
    const seasonDisplay = teamSeason ? ` - ${teamSeason}` : '';
    
    // Create the invitation email HTML
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Team Invitation - BlitzBoard Stats</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #1a1a1a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #2a2a2a; border-radius: 8px; overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #10B981 100%); padding: 40px 30px; text-align: center;">
                <img src="${logoUrl}" alt="BlitzBoard Stats Logo" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 10px;" />
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Youth & High School Football Management</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 24px;">You're Invited to Join ${teamName} for the Gridiron Battle!</h2>
                
                <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    ${inviterName} has invited you to join <strong style="color: #8B5CF6;">${teamName}</strong> on BlitzBoard Stats for the ultimate Gridiron battle experience.
                </p>
                
                <!-- Team Details -->
                <div style="background-color: #374151; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px;">Team Details</h3>
                    <div style="color: #d1d5db;">
                        <p style="margin: 5px 0;"><strong>Team:</strong> ${teamName}</p>
                        <p style="margin: 5px 0;"><strong>Division:</strong> ${divisionDisplay}${seasonDisplay}</p>
                        <p style="margin: 5px 0;"><strong>Your Role:</strong> ${roleDisplay}</p>
                        ${teamAgeGroup ? `<p style="margin: 5px 0;"><strong>Age Group:</strong> ${teamAgeGroup}</p>` : ''}
                    </div>
                </div>
                
                <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                    BlitzBoard Stats helps teams dominate the Gridiron by managing players, tracking statistics, scheduling events, and maintaining seamless team communication throughout the season.
                </p>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${smartRedirectUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #10B981 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                        Join ${teamName} for the Gridiron Battle
                    </a>
                </div>
                
                <div style="background-color: #1f2937; border-left: 4px solid #8B5CF6; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <p style="color: #d1d5db; margin: 0; font-size: 14px;">
                        <strong>Getting Started:</strong><br>
                        1. Click the button above to join the Gridiron battle<br>
                        2. Create an account if you don't have one (use this email: ${to})<br>
                        3. Accept the team invitation in your dashboard<br>
                        4. Access the BlitzBoard Stats portal for team communications, stats tracking, and game preparation
                    </p>
                </div>
                
                <p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
                    If you already have a BlitzBoard Stats account, you'll be taken directly to your teams page where you can access all team communications, player statistics, and schedule management features.
                </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #111827; padding: 20px 30px; text-align: center;">
                <p style="color: #6b7280; margin: 0; font-size: 14px;">
                    This invitation was sent via BlitzBoard Stats - Your Gridiron Command Center<br>
                    Questions? Contact your team organizer or visit our support page.
                </p>
                <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 12px;">
                    Don't want to receive team invitations? <a href="mailto:unsubscribe@mg.blitzboardstats.com?subject=Unsubscribe%20Request&body=Please%20unsubscribe%20me%20from%20team%20invitations." style="color: #8B5CF6; text-decoration: underline;">Unsubscribe here</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    // Create plain text version
    const emailText = `
You're Invited to Join ${teamName}!

${inviterName} has invited you to join ${teamName} on BlitzBoard Stats for the ultimate Gridiron battle experience.

Team Details:
- Team: ${teamName}
- Division: ${divisionDisplay}${seasonDisplay}
- Your Role: ${roleDisplay}
${teamAgeGroup ? `- Age Group: ${teamAgeGroup}` : ''}

BlitzBoard Stats helps teams dominate the Gridiron by managing players, tracking statistics, scheduling events, and maintaining seamless team communication throughout the season.

To join the Gridiron battle:
1. Visit: ${smartRedirectUrl}
2. Create an account if you don't have one (use this email: ${to})
3. Accept the team invitation in your dashboard
4. Access the BlitzBoard Stats portal for team communications, stats tracking, and game preparation

If you already have a BlitzBoard Stats account, you'll be taken directly to your teams page where you can access all team communications, player statistics, and schedule management features.

This invitation was sent via BlitzBoard Stats - Your Gridiron Command Center.
Questions? Contact your team organizer.

To unsubscribe from team invitations, reply to this email with "UNSUBSCRIBE" in the subject line.
    `;
    
    // Build Mailgun multipart payload
    const form = new FormData();
    form.append("from", `BlitzBoard Stats <invitations@mg.blitzboardstats.com>`);
    form.append("to", to);
    form.append("subject", `You're invited to join ${teamName} on BlitzBoard Stats - Gridiron Battle Awaits!`);
    form.append("text", emailText);
    form.append("html", emailHtml);
    form.append("h:Reply-To", user.email || "support@blitzboardstats.com");
    
    console.log('Sending email via Mailgun...');
    
    // Send the request to Mailgun
    const resp = await fetch("https://api.mailgun.net/v3/mg.blitzboardstats.com/messages", {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`api:${mailgunKey}`)
      },
      body: form
    });
    
    if (!resp.ok) {
      const err = await resp.text();
      console.error('Mailgun error response:', {
        status: resp.status,
        statusText: resp.statusText,
        error: err
      });
      return new Response(
        JSON.stringify({ 
          error: 'Email service error',
          code: 'MAILGUN_ERROR',
          details: err,
          status: resp.status,
          statusText: resp.statusText
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }
    
    const result = await resp.text();
    console.log('Invitation email sent successfully via Mailgun:', result);
    
    return new Response(
      JSON.stringify({ 
        message: "Invitation email sent successfully", 
        user: user.email,
        recipient: to,
        mailgunResponse: result
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
    
  } catch (error) {
    console.error('Error in send-invitation-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
        details: error.message,
        stack: error.stack
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
});
