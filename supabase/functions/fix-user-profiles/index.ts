
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

    // First, let's check the current structure of user_profiles
    const { data: tableInfo, error: tableError } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .limit(1)

    console.log('Current user_profiles structure check:', { tableInfo, tableError })

    // Try to add missing columns if they don't exist
    const alterCommands = [
      'ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS guardian_email text;',
      'ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS joined_teams uuid[] DEFAULT \'{}\';'
    ]

    for (const command of alterCommands) {
      try {
        const { error } = await supabaseClient.rpc('exec_sql', { sql: command })
        if (error) {
          console.log('Column might already exist or other issue:', error.message)
        }
      } catch (e) {
        console.log('Error adding column:', e.message)
      }
    }

    // Update the handle_new_user function to be more robust
    const functionSQL = `
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = ''
      AS $function$
      BEGIN
        INSERT INTO public.user_profiles (
          id, 
          display_name, 
          email, 
          role, 
          onboarding_completed, 
          onboarding_step,
          guardian_email,
          joined_teams
        )
        VALUES (
          NEW.id,
          COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
          NEW.email,
          COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'parent'::user_role),
          false,
          'role_selection',
          NEW.raw_user_meta_data ->> 'guardian_email',
          '{}'::uuid[]
        )
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          display_name = COALESCE(EXCLUDED.display_name, user_profiles.display_name),
          updated_at = now();
        RETURN NEW;
      END;
      $function$;
    `

    const { error: functionError } = await supabaseClient.rpc('exec_sql', { sql: functionSQL })
    
    if (functionError) {
      console.error('Error updating function:', functionError)
      return new Response(JSON.stringify({ error: functionError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'User profiles structure and function updated successfully'
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
