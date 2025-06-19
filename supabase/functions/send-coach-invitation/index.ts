import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CoachInvitationRequest {
  coachName: string;
  coachEmail: string;
  teamName: string;
  inviterName: string;
  role: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { coachName, coachEmail, teamName, inviterName, role }: CoachInvitationRequest = await req.json();

    if (!coachEmail || !teamName || !inviterName) {
      throw new Error("Missing required fields");
    }
    
    // Get the base URL for the portal link and logo
    const baseUrl = req.headers.get('origin') || 'https://your-app.lovable.app';
    const logoUrl = `${baseUrl}/lovable-uploads/8225b3cc-b640-4df3-9fdc-581d216e165b.png`;

    // Create the email HTML template
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You've been added as ${role} for ${teamName} - BlitzBoard Stats</title>
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
                <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 24px;">Welcome to ${teamName}!</h2>
                <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hi ${coachName},</p>
                <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">You have been added as a <strong style="color: #8B5CF6;">${role}</strong> for the team <strong style="color: #10B981;">${teamName}</strong> by ${inviterName}.</p>
                
                <!-- Portal Access CTA -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${baseUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #10B981 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                        Access BlitzBoard Stats Portal
                    </a>
                </div>
                
                <div style="background-color: #374151; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #10B981; margin: 0 0 15px 0; font-size: 18px;">What's Next?</h3>
                    <ul style="color: #d1d5db; margin: 0; padding-left: 20px;">
                        <li>Click the button above to access your coaching portal</li>
                        <li>You can now manage players and team activities</li>
                        <li>Create announcements for team members and parents</li>
                        <li>Access team schedules and events</li>
                        <li>Communicate with other coaches and team members</li>
                    </ul>
                </div>
                
                <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6; margin: 20px 0;">If you have any questions about your role or need help getting started, please don't hesitate to reach out to ${inviterName}.</p>
                
                <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6; margin: 20px 0;">Welcome to the team!</p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #111827; padding: 20px 30px; text-align: center;">
                <p style="color: #6b7280; margin: 0; font-size: 14px;">
                    This email was sent from BlitzBoard Stats Team Management App.<br>
                    Click the button above to access your coaching portal and get started.
                </p>
                <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 12px;">
                    Don't want to receive coaching invitations? <a href="mailto:unsubscribe@mg.blitzboardstats.com?subject=Unsubscribe%20Request&body=Please%20unsubscribe%20me%20from%20coaching%20invitations." style="color: #8B5CF6; text-decoration: underline;">Unsubscribe here</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Create plain text version
    const emailText = `Welcome to ${teamName}!

Hi ${coachName},

You have been added as a ${role} for the team ${teamName} by ${inviterName}.

Access BlitzBoard Stats Portal: ${baseUrl}

What's Next?
- Click the link above to access your coaching portal
- You can now manage players and team activities
- Create announcements for team members and parents
- Access team schedules and events
- Communicate with other coaches and team members

If you have any questions about your role or need help getting started, please don't hesitate to reach out to ${inviterName}.

Welcome to the team!

---
This email was sent from BlitzBoard Stats Team Management App.
Visit the portal link above to access your coaching dashboard and get started.

To unsubscribe from coaching invitations, reply to this email with "UNSUBSCRIBE" in the subject line.
    `;

    // Build Mailgun multipart payload
    const form = new FormData();
    form.append("from", `BlitzBoard Stats <coach@mg.blitzboardstats.com>`);
    form.append("to", coachEmail);
    form.append("subject", `You've been added as ${role} for ${teamName}`);
    form.append("text", emailText);
    form.append("html", emailHtml);

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
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    const result = await resp.text();
    console.log("Coach invitation email sent successfully:", result);

    return new Response(JSON.stringify({ message: "Coach invitation email sent successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-coach-invitation function:", error);
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
