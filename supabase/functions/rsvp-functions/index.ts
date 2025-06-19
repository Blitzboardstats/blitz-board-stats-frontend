
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RSVPRequest {
  eventId: string;
  userId: string;
  response: 'yes' | 'no' | 'maybe' | 'pending';
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { eventId, userId, response, notes }: RSVPRequest = await req.json();

    if (!eventId || !userId || !response) {
      throw new Error("Missing required fields: eventId, userId, response");
    }

    // Upsert RSVP with notes support
    const { data, error } = await supabaseClient
      .from('event_rsvps')
      .upsert({
        event_id: eventId,
        user_id: userId,
        response: response,
        notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting RSVP:', error);
      throw error;
    }

    console.log("RSVP updated successfully:", data);

    return new Response(JSON.stringify({ 
      message: "RSVP updated successfully",
      data: data 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in rsvp-functions:", error);
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
