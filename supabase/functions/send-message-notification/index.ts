
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
    const { messageId, recipientId, recipientEmail, senderName, messageContent, conversationId } = await req.json();
    
    console.log(`Sending message notification to ${recipientEmail} for message ${messageId}`);
    
    // Get the base URL for the portal link and logo
    const baseUrl = req.headers.get('origin') || 'https://your-app.lovable.app';
    const logoUrl = `${baseUrl}/lovable-uploads/8225b3cc-b640-4df3-9fdc-581d216e165b.png`;
    const messageLink = `${baseUrl}/huddle?conversation=${conversationId}`;
    
    // Create the email HTML template
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Message from ${senderName} - BlitzBoard Stats</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #1a1a1a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #2a2a2a; border-radius: 8px; overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #8B5CF6 0%, #10B981 100%); padding: 40px 30px; text-align: center;">
                <img src="${logoUrl}" alt="BlitzBoard Stats Logo" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 10px;" />
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">💬 New Message</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">BlitzBoard Stats Huddle</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 24px;">You have a new message!</h2>
                <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hi there,</p>
                <p style="color: #e5e7eb; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;"><strong style="color: #10B981;">${senderName}</strong> sent you a message on BlitzBoard Stats.</p>
                
                <!-- Message Preview -->
                <div style="background-color: #1f2937; border-left: 4px solid #8B5CF6; padding: 20px; margin: 20px 0; border-radius: 4px;">
                    <div style="color: #e5e7eb; font-size: 16px; line-height: 1.6;">${messageContent.substring(0, 200)}${messageContent.length > 200 ? '...' : ''}</div>
                </div>
                
                <!-- View Message CTA -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${messageLink}" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #10B981 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                        View & Reply in BlitzBoard Stats
                    </a>
                </div>
                
                <div style="background-color: #374151; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <h3 style="color: #10B981; margin: 0 0 15px 0; font-size: 18px;">Why reply in BlitzBoard Stats?</h3>
                    <ul style="color: #d1d5db; margin: 0; padding-left: 20px;">
                        <li>Keep all team communications in one place</li>
                        <li>Maintain conversation history for everyone</li>
                        <li>Access team context and information</li>
                        <li>Stay connected with your team community</li>
                    </ul>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 20px 0; text-align: center;">
                    Click the button above to continue the conversation in BlitzBoard Stats where your entire team can stay connected.
                </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #111827; padding: 20px 30px; text-align: center;">
                <p style="color: #6b7280; margin: 0; font-size: 14px;">
                    BlitzBoard Stats - Keeping Teams Connected<br>
                    This message notification was sent from our secure team communication system.
                </p>
                <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 12px;">
                    Don't want to receive message notifications? <a href="mailto:unsubscribe@mg.blitzboardstats.com?subject=Unsubscribe%20Request&body=Please%20unsubscribe%20me%20from%20message%20notifications." style="color: #8B5CF6; text-decoration: underline;">Unsubscribe here</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    // Create plain text version
    const emailText = `New Message from ${senderName} - BlitzBoard Stats

Hi there,

${senderName} sent you a message on BlitzBoard Stats:

"${messageContent.substring(0, 200)}${messageContent.length > 200 ? '...' : ''}"

View and reply to this message: ${messageLink}

Why reply in BlitzBoard Stats?
- Keep all team communications in one place
- Maintain conversation history for everyone  
- Access team context and information
- Stay connected with your team community

Click the link above to continue the conversation in BlitzBoard Stats where your entire team can stay connected.

---

BlitzBoard Stats - Keeping Teams Connected
This message notification was sent from our secure team communication system.

To unsubscribe from message notifications, reply to this email with "UNSUBSCRIBE" in the subject line.
    `;
    
    // Build Mailgun multipart payload
    const form = new FormData();
    form.append("from", `BlitzBoard Stats <messages@mg.blitzboardstats.com>`);
    form.append("to", recipientEmail);
    form.append("subject", `💬 New message from ${senderName}`);
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
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }
    
    const result = await resp.text();
    console.log('Message notification sent successfully:', result);
    
    // Record the notification in the database
    const { error: insertError } = await supabase
      .from('message_notifications')
      .insert({
        message_id: messageId,
        recipient_id: recipientId,
        recipient_email: recipientEmail
      });
    
    if (insertError) {
      console.error('Error recording notification:', insertError);
    }
    
    return new Response(
      JSON.stringify({ message: "Message notification sent successfully" }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
    
  } catch (error) {
    console.error('Error in send-message-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
});
