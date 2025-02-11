import "https://deno.land/x/xhr@0.1.0/mod.ts";

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {

'Access-Control-Allow-Origin': '*',

'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',

};

const SD_API_URL = "https://cmu1y1vzlhnnab-3001.proxy.runpod.net";

serve(async (req) => {

console.log('Function invoked:', {

method: req.method,
url: req.url,
headers: Object.fromEntries(req.headers.entries())
});

// Handle CORS preflight

if (req.method === 'OPTIONS') {

return new Response(null, { headers: corsHeaders });
}

try {

// Parse and validate request
const { prompt } = await req.json();
console.log('Received prompt:', prompt);
if (!prompt || typeof prompt !== 'string') {
  throw new Error('Invalid prompt: Must be a non-empty string');
}
// Health check
try {
  console.log('Performing health check...');
  const healthCheck = await fetch(`${SD_API_URL}/healthcheck`);
  if (!healthCheck.ok) {
    const healthCheckText = await healthCheck.text();
    console.error('Health check failed:', {
      status: healthCheck.status,
      response: healthCheckText
    });
    throw new Error(`API health check failed: ${healthCheck.status}`);
  }
  console.log('Health check passed');
} catch (error) {
  console.error('Health check error:', error);
  throw new Error(`Stable Diffusion API unavailable: ${error.message}`);
}
// Prepare request body
const requestBody = {
  prompt: prompt,
  negative_prompt: "bad quality, worst quality, low quality, normal quality, lowres, low resolution, blurry, text, watermark, signature, error",
  steps: 30,
  cfg_scale: 7.5,
  width: 512,
  height: 512,
  sampler_name: "DPM++ 2M Karras",
  batch_size: 1,
  n_iter: 1,
  seed: -1,
  enable_hr: false,
  denoising_strength: 0.7,
  restore_faces: true
};
console.log('Sending request to SD API:', {
  url: `${SD_API_URL}/sdapi/v1/txt2img`,
  body: requestBody
});
// Make request to SD API
const response = await fetch(`${SD_API_URL}/sdapi/v1/txt2img`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify(requestBody)
});
if (!response.ok) {
  const errorText = await response.text();
  console.error('SD API error:', {
    status: response.status,
    statusText: response.statusText,
    body: errorText
  });
  throw new Error(`SD API error: ${response.status} - ${errorText}`);
}
const data = await response.json();
console.log('Received response from SD API');
if (!data.images || !data.images.length) {
  console.error('No images in response:', data);
  throw new Error('No images in response from SD API');
}
// Return the base64 image
return new Response(
  JSON.stringify({ 
    success: true, 
    image: `data:image/png;base64,${data.images[0]}` 
  }),
  { 
    headers: { 
      ...corsHeaders, 
      'Content-Type': 'application/json' 
    } 
  }
);
} catch (error) {

console.error('Error in generate-image-runpod:', {
  error: error.message,
  stack: error.stack,
  timestamp: new Date().toISOString()
});
return new Response(
  JSON.stringify({ 
    success: false, 
    error: error.message,
    timestamp: new Date().toISOString()
  }),
  { 
    status: 500, 
    headers: { 
      ...corsHeaders, 
      'Content-Type': 'application/json' 
    } 
  }
);
}

});