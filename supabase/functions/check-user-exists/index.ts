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
    // Parsing the email from the request body
    const { email } = await req.json();
    if (!email) {
      console.log('No email provided');
      throw new Error('Email is required');
    }

    // Get Supabase URL and service role key from environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    // Creating Supabase client securely
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    let page = 1;
    let userExists = false;

    // Dynamically paginate through users
    while (true) {
      const { data: users, error } = await supabase.auth.admin.listUsers({
        page,
        perPage: 100,  // Adjust as necessary
      });

      if (error) {
        console.error('Query error occurred while fetching users');
        throw error;  // Don't log the actual error message to avoid exposure
      }

      // Check if the email exists on the current page of users
      userExists = users.some(user => user.email === email);

      if (userExists) {
        break;  // Exit loop if user is found
      }

      // Break the loop if there are no more users to query
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
    console.error('Error in function execution, check logs for details');
    return new Response(
      JSON.stringify({ error: 'An error occurred while checking user existence' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
