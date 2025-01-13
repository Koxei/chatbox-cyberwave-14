// supabase/functions/check-user-exists/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Function started');
    
    const { email } = await req.json();
    console.log('Email received:', email);

    if (!email) {
      console.log('No email provided');
      throw new Error('Email is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('Creating Supabase client');
    const supabase = createClient(supabaseUrl!, supabaseKey!);

    console.log('Querying users');
    const { data: { users }, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      filter: { email }
    });

    if (error) {
      console.error('Query error:', error);
      throw error;
    }

    const exists = Boolean(users?.length);
    console.log('User exists:', exists);

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
      JSON.stringify({ error: error.message, exists: false }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
