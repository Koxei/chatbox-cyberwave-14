import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    console.log('Received prompt:', prompt);

    const RUNPOD_API_KEY = Deno.env.get('RUNPOD_API_KEY');
    if (!RUNPOD_API_KEY) {
      throw new Error('RUNPOD_API_KEY is not set');
    }

    // First, send the request to generate the image
    const response = await fetch('https://api.runpod.ai/v2/mc5goz5ibjjq6p/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': RUNPOD_API_KEY
      },
      body: JSON.stringify({
        input: {
          prompt: prompt,
          negative_prompt: "bad quality, worst quality, low quality, normal quality, lowres, low resolution, blurry, text, watermark, signature, error",
          num_inference_steps: 30,
          guidance_scale: 7.5,
          width: 512,
          height: 512,
          num_outputs: 1
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Runpod API error:', error);
      throw new Error(`Runpod API error: ${error.message}`);
    }

    const { id } = await response.json();
    console.log('Generation started with ID:', id);

    // Poll for the result
    let result = null;
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout

    while (!result && attempts < maxAttempts) {
      const statusResponse = await fetch(`https://api.runpod.ai/v2/mc5goz5ibjjq6p/status/${id}`, {
        headers: {
          'Authorization': RUNPOD_API_KEY
        }
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to check generation status');
      }

      const statusData = await statusResponse.json();
      console.log('Status check attempt', attempts + 1, ':', statusData.status);

      if (statusData.status === 'COMPLETED') {
        result = statusData;
        break;
      } else if (statusData.status === 'FAILED') {
        throw new Error('Image generation failed');
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between checks
    }

    if (!result) {
      throw new Error('Image generation timed out');
    }

    console.log('Successfully generated image');

    return new Response(
      JSON.stringify({ 
        success: true, 
        image: result.output.image 
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
        error: error.message 
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