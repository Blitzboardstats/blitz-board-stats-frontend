import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GuardianWelcomeRequest {
  guardianName: string;
  guardianEmail: string;
  playerName: string;
  teamName: string;
  coachName: string;
  ageGroup?: string;
  footballType?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { guardianName, guardianEmail, playerName, teamName, coachName, ageGroup, footballType }: GuardianWelcomeRequest = await req.json();

    if (!guardianEmail || !playerName || !teamName || !coachName) {
      throw new Error("Missing required fields");
    }

    const displayGuardianName = guardianName || "Parent/Guardian";
    
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
        <title>${playerName} has been added to ${teamName} - BlitzBoard Stats</title>
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
                <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hi ${displayGuardianName},</p>
                <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">We're excited to let you know that <strong style="color: #8B5CF6;">${playerName}</strong> has been added to the <strong style="color: #10B981;">${teamName}</strong> roster!</p>
                
                <div style="background-color: #374151; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px;">Team Information</h3>
                    <div style="color: #d1d5db;">
                        <p style="margin: 5px 0;"><strong>Team:</strong> ${teamName}</p>
                        <p style="margin: 5px 0;"><strong>Player:</strong> ${playerName}</p>
                        ${ageGroup ? `<p style="margin: 5px 0;"><strong>Division/Age Group:</strong> ${ageGroup}</p>` : ''}
                        ${footballType ? `<p style="margin: 5px 0;"><strong>Gridiron Battle:</strong> ${footballType}</p>` : ''}
                        <p style="margin: 5px 0;"><strong>Coach:</strong> ${coachName}</p>
                    </div>
                </div>
                
                <!-- Portal Access CTA -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${baseUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #10B981 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                        Access BlitzBoard Stats Portal
                    </a>
                </div>
                
                <div style="background-color: #1f2937; border-left: 4px solid #8B5CF6; padding: 20px; margin: 20px 0; border-radius: 4px;">
                    <h3 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px;">What to Expect</h3>
                    <ul style="color: #d1d5db; margin: 0; padding-left: 20px;">
                        <li>You'll receive team announcements and updates via email</li>
                        <li>Important schedule changes and event notifications</li>
                        <li>Regular communication from coaches about team activities</li>
                        <li>Information about games, practices, and team events</li>
                        <li>Access to the team portal for real-time updates</li>
                    </ul>
                </div>
                
                <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6; margin: 20px 0;">If you have any questions about the team, practices, or upcoming events, please don't hesitate to reach out to Coach ${coachName}.</p>
                
                <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6; margin: 20px 0;">We look forward to a great season with ${playerName} on the team!</p>
                
                <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6; margin: 20px 0;">Go team!</p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #111827; padding: 20px 30px; text-align: center;">
                <p style="color: #6b7280; margin: 0; font-size: 14px;">
                    This email was sent from BlitzBoard Stats Team Management App.<br>
                    Click the button above to access your team portal and stay connected.
                </p>
                <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 12px;">
                    Don't want to receive team notifications? <a href="mailto:unsubscribe@mg.blitzboardstats.com?subject=Unsubscribe%20Request&body=Please%20unsubscribe%20me%20from%20team%20notifications." style="color: #8B5CF6; text-decoration: underline;">Unsubscribe here</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    // Create plain text version
    const emailText = `Welcome to ${teamName}!

Hi ${displayGuardianName},

We're excited to let you know that ${playerName} has been added to the ${teamName} roster!

Team Information:
- Team: ${teamName}
- Player: ${playerName}
${ageGroup ? `- Division/Age Group: ${ageGroup}` : ''}
${footballType ? `- Gridiron Battle: ${footballType}` : ''}
- Coach: ${coachName}

Access BlitzBoard Stats Portal: ${baseUrl}

What to Expect:
- You'll receive team announcements and updates via email
- Important schedule changes and event notifications
- Regular communication from coaches about team activities
- Information about games, practices, and team events
- Access to the team portal for real-time updates

If you have any questions about the team, practices, or upcoming events, please don't hesitate to reach out to Coach ${coachName}.

We look forward to a great season with ${playerName} on the team!

Go team!

---
This email was sent from BlitzBoard Stats Team Management App.
Visit the portal link above to access your team information and stay connected.

To unsubscribe from team notifications, reply to this email with "UNSUBSCRIBE" in the subject line.
    `;

    // Build Mailgun multipart payload
    const form = new FormData();
    form.append("from", `BlitzBoard Stats <team@mg.blitzboardstats.com>`);
    form.append("to", guardianEmail);
    form.append("subject", `${playerName} has been added to ${teamName}`);
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
    console.log("Guardian welcome email sent successfully:", result);

    return new Response(JSON.stringify({ message: "Guardian welcome email sent successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-guardian-welcome function:", error);
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
