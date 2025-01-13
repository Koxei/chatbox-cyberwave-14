// supabase/functions/check-user-exists/index.ts
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function for consistent logging
const logEvent = (message: string, data?: any) => {
  const logData = data ? `${message}: ${JSON.stringify(data)}` : message;
  // Force immediate console output
  console.log(logData);
  // Ensure logs are flushed
  Deno.stderr.writeSync(new TextEncoder().encode(logData + '\n'));
};

Deno.serve(async (req) => {
  // Log every request immediately
  logEvent('Request received', {
    method: req.method,
    url: req.url
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    logEvent('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log request body
    const body = await req.json();
    logEvent('Request body received', body);
    const { email } = body;

    if (!email) {
      logEvent('Error: No email provided');
      throw new Error('Email is required');
    }

    // Create Supabase admin client
    logEvent('Creating Supabase admin client');
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

    // Different approach: Use auth.users directly with email filter
    logEvent('Querying auth.users');
    const { data: { users }, error: adminError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      filter: {
        email: email
      }
    });
    
    logEvent('Query result', {
      hasUsers: !!users?.length,
      userCount: users?.length ?? 0,
      hasError: !!adminError
    });

    if (adminError) {
      logEvent('Admin API error', adminError);
      throw adminError;
    }

    const exists = users && users.length > 0;
    logEvent('User existence check result', { exists });

    // Create response
    const response = { exists };
    logEvent('Sending response', response);

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    logEvent('Error in edge function', {
      message: error.message,
      stack: error.stack
    });

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
