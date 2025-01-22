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

    console.log('Initiating RunPod request...');

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

    console.log('RunPod API Response Status:', response.status);
    
    // Log the raw response text for debugging
    const responseText = await response.text();
    console.log('RunPod API Raw Response:', responseText);

    if (!response.ok) {
      throw new Error(`RunPod API HTTP error! status: ${response.status}, response: ${responseText}`);
    }

    // Parse the response text as JSON
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse RunPod response as JSON:', parseError);
      throw new Error(`Invalid JSON response from RunPod: ${responseText}`);
    }

    const { id } = jsonResponse;
    if (!id) {
      throw new Error(`No job ID received from RunPod. Response: ${responseText}`);
    }

    console.log('Generation started with ID:', id);

    // Poll for the result
    let result = null;
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout

    while (!result && attempts < maxAttempts) {
      console.log(`Checking status attempt ${attempts + 1}...`);
      
      const statusResponse = await fetch(`https://api.runpod.ai/v2/mc5goz5ibjjq6p/status/${id}`, {
        headers: {
          'Authorization': RUNPOD_API_KEY
        }
      });

      if (!statusResponse.ok) {
        const statusText = await statusResponse.text();
        console.error('Status check failed:', statusText);
        throw new Error(`Failed to check generation status: ${statusResponse.status}, response: ${statusText}`);
      }

      const statusData = await statusResponse.json();
      console.log('Status check response:', JSON.stringify(statusData, null, 2));

      if (statusData.status === 'COMPLETED') {
        result = statusData;
        break;
      } else if (statusData.status === 'FAILED') {
        throw new Error(`Image generation failed. Status data: ${JSON.stringify(statusData)}`);
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between checks
    }

    if (!result) {
      throw new Error('Image generation timed out after 30 seconds');
    }

    if (!result.output?.image) {
      throw new Error(`No image in output. Full result: ${JSON.stringify(result)}`);
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
        error: error.message,
        details: error.stack
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