import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SD_API_URL = "https://cmu1y1vzlhnnab-3001.proxy.runpod.net";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    console.log('Received prompt:', prompt);

    // Prepare the request body for Automatic1111 API
    const requestBody = {
      prompt: prompt,
      negative_prompt: "bad quality, worst quality, low quality, normal quality, lowres, low resolution, blurry, text, watermark, signature, error",
      steps: 30,
      cfg_scale: 7.5,
      width: 512,
      height: 512,
      sampler_name: "DPM++ 2M Karras",
      batch_size: 1
    };

    console.log('Sending request to Stable Diffusion API:', JSON.stringify(requestBody));

    // Make request to your Stable Diffusion instance
    const response = await fetch(`${SD_API_URL}/sdapi/v1/txt2img`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Stable Diffusion API error:', errorText);
      throw new Error(`Stable Diffusion API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Successfully received response from Stable Diffusion API');

    if (!data.images || data.images.length === 0) {
      throw new Error('No images in response from Stable Diffusion API');
    }

    // The API returns base64 images directly
    const generatedImage = data.images[0];

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
    console.error('Error in generate-image-runpod function:', error);
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