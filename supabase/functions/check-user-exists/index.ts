// supabase/functions/check-user-exists/index.ts
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Edge function called');
    const { email } = await req.json();
    console.log('Checking existence for email:', email);

    if (!email) {
      console.error('No email provided');
      throw new Error('Email is required');
    }

    // Create Supabase client with service role key
    console.log('Creating Supabase admin client');
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('Querying auth.users for email:', email);
    const { data: { users }, error: adminError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      query: email
    });
    
    console.log('Query result:', { 
      userCount: users?.length ?? 0,
      hasError: !!adminError
    });

    if (adminError) {
      console.error('Admin API error:', adminError);
      throw adminError;
    }

    const exists = users && users.length > 0;
    console.log('User exists:', exists);

    return new Response(
      JSON.stringify({ exists }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        exists: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
