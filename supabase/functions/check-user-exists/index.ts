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
    if (!email) {
      console.log('No email provided');
      throw new Error('Email is required');
    }

    // Mask email in logs (or avoid logging in production environments)
    const emailMasked = email.replace(/(.{2})(.*)(?=@)/, '$1*****$3');
    console.log('Checking existence for email:', emailMasked);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables');
    }

    console.log('Creating Supabase client');
    const supabase = createClient(supabaseUrl, supabaseKey);

    let userExists = false;
    let page = 1;

    // Paginate through users to check existence in auth.users table
    while (true) {
      console.log(`Querying auth.users, Page: ${page}`);
      const { data: { users }, error: authError } = await supabase.auth.admin.listUsers({
        page,
        perPage: 100, // Adjust based on your needs
        filter: { email }
      });

      if (authError) {
        console.error('Error querying auth.users:', authError);
        throw new Error('Error querying Supabase users');
      }

      // Check if email exists in this page of results
      if (users?.some(user => user.email === email)) {
        userExists = true;
        break;
      }

      // If no more users are available, stop pagination
      if (users.length < 100) {
        break;
      }

      // Increment page for next batch
      page++;
    }

    if (!userExists) {
      console.log('User not found in auth.users');
      return new Response(
        JSON.stringify({ exists: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If user exists, proceed to check if the user has a profile
    const { data: { users } } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      filter: { email }
    });

    const userId = users[0].id;
    console.log('Found user in auth.users with ID:', userId);

    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId);

    if (profileError) {
      console.error('Error querying profiles:', profileError);
      throw new Error('Error querying user profile');
    }

    const exists = profiles?.length > 0;
    console.log('Final existence check:', exists);

    // Only send verification email if the user exists in profiles as well
    if (exists) {
      console.log('User exists in profiles. Proceeding with verification email.');
      // Here, you can trigger the actual email verification action (e.g., sending a verification email).
    } else {
      console.log('User exists in auth.users but has no profile. No email verification sent.');
    }

    return new Response(
      JSON.stringify({ exists }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    // Only log non-sensitive error messages
    console.error('Function error:', error.message);

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
