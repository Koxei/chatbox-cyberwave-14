import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Function started');
    
    // Parse the email from the request body
    const { email } = await req.json();
    console.log('Email received:', email);

    if (!email) {
      console.log('No email provided');
      throw new Error('Email is required');
    }

    // Get Supabase URL and key from environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('Creating Supabase client');
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    let page = 1;
    let userExists = false;

    // Dynamically paginate through users until we find the email or exhaust pages
    while (true) {
      console.log(`Querying users on page ${page}`);
      const { data: users, error } = await supabase.auth.admin.listUsers({
        page,
        perPage: 100,  // Adjust based on expected user count, 100 is a good start
      });

      if (error) {
        console.error('Query error:', error);
        throw error;
      }

      // Check if the email exists in the current page of users
      userExists = users.some(user => user.email === email);

      if (userExists) {
        console.log('User exists:', userExists);
        break;
      }

      // If there are no users left to query, break the loop
      if (users.length === 0 || users.length < 100) {
        break;
      }

      // Move to the next page
      page++;
    }

    return new Response(
      JSON.stringify({ exists: userExists }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message, exists: false }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
