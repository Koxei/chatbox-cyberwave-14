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
// Mask email in logs for security
const emailMasked = email.replace(/(.{2})(.*)(?=@)/, '$1*****');
console.log('Checking existence for:', emailMasked);
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing environment variables');
}
const supabase = createClient(supabaseUrl, supabaseKey);
let userExists = false;
let page = 1;
let hasMore = true;
// Paginate through users to check existence
while (hasMore && !userExists) {
  console.log(`Checking page ${page}`);
  const { data: { users }, error } = await supabase.auth.admin.listUsers({
    page,
    perPage: 100,
  });
  if (error) {
    console.error('Error querying users:', error.message);
    throw new Error('Error checking email existence');
  }
  // Case-insensitive email comparison
  userExists = users.some(user => 
    user.email?.toLowerCase() === email.toLowerCase()
  );
  // Check if we need to continue pagination
  hasMore = users.length === 100;
  if (!userExists && hasMore) {
    page++;
  }
}
console.log(`Email check complete. Exists: ${userExists}`);
return new Response(
  JSON.stringify({ exists: userExists }),
  { 
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200
  }
);
} catch (error) {

console.error('Function error:', error.message);
return new Response(
  JSON.stringify({
    error: 'An error occurred while checking email existence',
    exists: false
  }),
  { 
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 400
  }
);
}

});