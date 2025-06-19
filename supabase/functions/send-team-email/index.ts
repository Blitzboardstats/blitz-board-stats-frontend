
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
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Parse request body
    const { to, subject, text, teamNames, coachName } = await req.json();
    
    // Log the email activity with user information
    console.log(`Email sent by user ${user.id} (${user.email}) to: ${Array.isArray(to) ? to.join(", ") : to}`);
    console.log(`Subject: ${subject}`);
    
    // Create the team email HTML template
    const teamNamesText = Array.isArray(teamNames) ? teamNames.join(', ') : teamNames;
    
    // Get the base URL for the portal link and logo
    const baseUrl = req.headers.get('origin') || 'https://your-app.lovable.app';
    const logoUrl = `${baseUrl}/lovable-uploads/8225b3cc-b640-4df3-9fdc-581d216e165b.png`;
    
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject} - BlitzBoard Stats</title>
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
                <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 24px;">${subject}</h2>
                
                <!-- Team Info -->
                <div style="background-color: #374151; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #10B981; margin: 0 0 15px 0; font-size: 18px;">From Your Coach</h3>
                    <div style="color: #d1d5db;">
                        <p style="margin: 5px 0;"><strong>Coach:</strong> ${coachName}</p>
                        <p style="margin: 5px 0;"><strong>Team(s):</strong> ${teamNamesText}</p>
                    </div>
                </div>
                
                <!-- Message Content -->
                <div style="background-color: #1f2937; border-left: 4px solid #8B5CF6; padding: 20px; margin: 20px 0; border-radius: 4px;">
                    <div style="color: #e5e7eb; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${text}</div>
                </div>
                
                <!-- Portal Access CTA -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${baseUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #10B981 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                        Go to BlitzBoard Stats Portal
                    </a>
                </div>
                
                <!-- Footer Message -->
                <div style="background-color: #111827; border-radius: 8px; padding: 15px; margin: 20px 0;">
                    <p style="color: #9ca3af; margin: 0; font-size: 14px; text-align: center;">
                        <strong style="color: #10B981;">Stay Connected with BlitzBoard Stats</strong><br>
                        This message was sent through our secure team communication system.<br>
                        Click the button above to access your team portal and view all communications.
                    </p>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0; text-align: center;">
                    Questions about BlitzBoard Stats? Visit our support page or contact your team administrator.
                </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #111827; padding: 20px 30px; text-align: center;">
                <p style="color: #6b7280; margin: 0; font-size: 14px;">
                    BlitzBoard Stats - Empowering Youth & High School Football<br>
                    <span style="color: #8B5CF6;">●</span> Team Management <span style="color: #8B5CF6;">●</span> Player Stats <span style="color: #8B5CF6;">●</span> Communication <span style="color: #8B5CF6;">●</span> Scheduling
                </p>
                <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 12px;">
                    Don't want to receive team communications? <a href="mailto:unsubscribe@mg.blitzboardstats.com?subject=Unsubscribe%20Request&body=Please%20unsubscribe%20me%20from%20team%20communications." style="color: #8B5CF6; text-decoration: underline;">Unsubscribe here</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    // Create plain text version
    const emailText = `${subject}

From Your Coach: ${coachName}
Team(s): ${teamNamesText}

Message:
${text}

Access BlitzBoard Stats Portal: ${baseUrl}

---

Best regards,
${coachName}
${teamNamesText}

This message was sent via BlitzBoard Stats Huddle.
Click the link above to access your team portal and view all communications.

BlitzBoard Stats - Empowering Youth & High School Football

To unsubscribe from team communications, reply to this email with "UNSUBSCRIBE" in the subject line.
    `;
    
    // Build Mailgun multipart payload
    const form = new FormData();
    form.append("from", `${coachName} <coach@mg.blitzboardstats.com>`);
    form.append("to", "coach@mg.blitzboardstats.com"); // Send to a dummy address since we're using BCC
    form.append("bcc", Array.isArray(to) ? to.join(",") : to); // Use BCC for privacy
    form.append("subject", subject);
    form.append("text", emailText);
    form.append("html", emailHtml);
    // Use the authenticated user's email as reply-to
    form.append("h:Reply-To", user.email || "replies@mg.blitzboardstats.com");
    
    // Send the request to Mailgun
    const resp = await fetch("https://api.mailgun.net/v3/mg.blitzboardstats.com/messages", {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`api:${Deno.env.get("MAILGUN_KEY")}`)
      },
      body: form
    });
    
    if (!resp.ok) {
      const err = await resp.text();
      console.error('Mailgun error:', err);
      return new Response(
        JSON.stringify({ error: err }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }
    
    const result = await resp.text();
    console.log('Email sent successfully:', result);
    
    return new Response(
      JSON.stringify({ message: "Email queued successfully", user: user.email }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
    
  } catch (error) {
    console.error('Error in send-team-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
});
