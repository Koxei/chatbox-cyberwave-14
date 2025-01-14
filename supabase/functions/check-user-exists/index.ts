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
    const { email } = await req.json();
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Query auth.users table efficiently
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      filter: {
        email: email.toLowerCase() // Case-insensitive comparison
      }
    });

    if (authError) {
      throw new Error('Error querying users');
    }

    const exists = users.length > 0;

    // Return minimal response
    return new Response(
      JSON.stringify({ exists }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    // Generic error response to avoid leaking implementation details
    return new Response(
      JSON.stringify({
        error: 'An error occurred while checking user existence',
        exists: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});