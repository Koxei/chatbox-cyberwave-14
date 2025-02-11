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

console.log('Starting signup email check');
const { email } = await req.json();
if (!email) {
  console.log('No email provided');
  throw new Error('Email is required');
}
// Mask email in logs for security
const emailMasked = email.replace(/(.{2})(.*)(?=@)/, '$1*****$3');
console.log('Checking signup availability for:', emailMasked);
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing environment variables');
}
console.log('Creating Supabase client for signup check');
const supabase = createClient(supabaseUrl, supabaseKey);
let page = 1;
// Early return optimization for signup flow
while (true) {
  console.log(`Checking auth.users page ${page}`);
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers({
    page,
    perPage: 100,
    filter: { email }
  });
  if (authError) {
    console.error('Error querying auth.users:', authError);
    throw new Error('Error checking email availability');
  }
  // Immediate return if email found (optimization for signup)
  if (users?.some(user => user.email.toLowerCase() === email.toLowerCase())) {
    console.log('Email already registered');
    return new Response(
      JSON.stringify({ 
        available: false,
        message: 'Email already registered'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
  // If we've checked all users, break
  if (!users || users.length < 100) {
    break;
  }
  page++;
}
// If we get here, email is available
console.log('Email available for signup');
return new Response(
  JSON.stringify({ 
    available: true,
    message: 'Email available'
  }),
  { 
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200
  }
);
} catch (error) {

console.error('Signup check error:', error.message);
return new Response(
  JSON.stringify({
    error: 'Error checking email availability',
    available: false
  }),
  { 
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 400
  }
);
}

});