import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SD_API_URL = "https://cmu1y1vzlhnnab-3001.proxy.runpod.net";

serve(async (req) => {
  console.log('Function invoked with request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    console.log('Received prompt:', prompt);

    // Validate prompt
    if (!prompt || typeof prompt !== 'string') {
      console.error('Invalid prompt received:', prompt);
      throw new Error('Invalid prompt: Must be a non-empty string');
    }

    // First, check if the API is accessible
    try {
      console.log('Performing health check...');
      const healthCheck = await fetch(`${SD_API_URL}/healthcheck`);
      if (!healthCheck.ok) {
        const healthCheckText = await healthCheck.text();
        console.error('Health check failed:', {
          status: healthCheck.status,
          response: healthCheckText
        });
        throw new Error(`API health check failed: ${healthCheck.status} - ${healthCheckText}`);
      }
      console.log('API health check passed');
    } catch (error) {
      console.error('API health check error:', error);
      throw new Error(`Stable Diffusion API is not accessible: ${error.message}`);
    }

    // Prepare the request body for Automatic1111 API
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

    console.log('Sending request to Stable Diffusion API:', JSON.stringify(requestBody));

    // Make request to Stable Diffusion instance
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
      console.error('Stable Diffusion API error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Stable Diffusion API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Successfully received response from Stable Diffusion API');

    if (!data.images || data.images.length === 0) {
      console.error('No images in response:', data);
      throw new Error('No images in response from Stable Diffusion API');
    }

    // The API returns base64 images directly
    const generatedImage = data.images[0];
    console.log('Successfully processed image generation');

    return new Response(
      JSON.stringify({ 
        success: true, 
        image: `data:image/png;base64,${generatedImage}` 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in generate-image-runpod function:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error.stack,
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