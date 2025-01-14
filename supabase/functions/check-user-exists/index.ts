// supabase/functions/handle-user-registration/index.ts
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
    console.log('Registration function started');

    const { email, password } = await req.json();
    if (!email || !password) {
      console.log('Missing required fields');
      throw new Error('Email and password are required');
    }

    // Mask email in logs for security
    const emailMasked = email.replace(/(.{2})(.*)(?=@)/, '$1*****');
    console.log('Processing registration for:', emailMasked);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables');
    }

    console.log('Creating Supabase admin client');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First check if user exists
    const { data: existingUsers, error: searchError } = await supabase.auth.admin.listUsers({
      filter: { email }
    });

    if (searchError) {
      console.error('Error checking existing user:', searchError);
      throw new Error('Error checking user existence');
    }

    if (existingUsers.users.length > 0) {
      console.log('User already exists');
      return new Response(
        JSON.stringify({ 
          error: 'User already exists',
          code: 'USER_EXISTS'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      );
    }

    // Proceed with user creation
    console.log('Creating new user');
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Auto-confirm email for now
    });

    if (createError) {
      console.error('Error creating user:', createError);
      throw createError;
    }

    console.log('User created successfully');
    return new Response(
      JSON.stringify({ 
        success: true,
        user: {
          id: newUser.user.id,
          email: newUser.user.email
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Function error:', error.message);
    return new Response(
      JSON.stringify({
        error: error.message,
        code: 'REGISTRATION_ERROR'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
