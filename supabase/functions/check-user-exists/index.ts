// supabase/functions/check-user-exists/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Function started');
    
    const { email } = await req.json();
    console.log('Checking existence for email:', email);

    if (!email) {
      console.log('No email provided');
      throw new Error('Email is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables');
    }

    console.log('Creating Supabase client');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First, get the user from auth.users
    console.log('Querying auth.users');
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      filter: { email }
    });

    console.log('Auth query result:', { 
      hasUsers: Boolean(users?.length),
      userCount: users?.length ?? 0,
      error: authError ? authError.message : null
    });

    if (authError) {
      console.error('Auth query error:', authError);
      throw authError;
    }

    if (!users || users.length === 0) {
      console.log('User not found in auth.users');
      return new Response(
        JSON.stringify({ exists: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = users[0].id;
    console.log('Found user in auth.users with ID:', userId);

    // Then, check if they exist in public.profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId);

    console.log('Profile query result:', {
      hasProfiles: Boolean(profiles?.length),
      profileCount: profiles?.length ?? 0,
      error: profileError ? profileError.message : null
    });

    if (profileError) {
      console.error('Profile query error:', profileError);
      throw profileError;
    }

    const exists = Boolean(profiles && profiles.length > 0);
    console.log('Final existence check:', exists);

    return new Response(
      JSON.stringify({ exists }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        exists: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
