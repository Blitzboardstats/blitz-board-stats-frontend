
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Find Houston Cougars team
    const { data: teams, error: fetchError } = await supabaseClient
      .from('teams')
      .select('*')
      .or('name.ilike.%houston%cougars%,name.ilike.%houston%cougar%')

    if (fetchError) {
      console.error('Error fetching teams:', fetchError)
      return new Response(JSON.stringify({ error: fetchError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!teams || teams.length === 0) {
      return new Response(JSON.stringify({ error: 'Houston Cougars team not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const logoUrl = '/lovable-uploads/c4435197-509b-4d88-9694-b40dc6594be6.png'

    // Update all matching teams with the logo
    const updatedTeams = []
    for (const team of teams) {
      const { data: updatedTeam, error: updateError } = await supabaseClient
        .from('teams')
        .update({ logo_url: logoUrl })
        .eq('id', team.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating team:', updateError)
        continue
      }

      updatedTeams.push(updatedTeam)
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Updated ${updatedTeams.length} Houston Cougars team(s) with logo`,
      teams: updatedTeams
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
