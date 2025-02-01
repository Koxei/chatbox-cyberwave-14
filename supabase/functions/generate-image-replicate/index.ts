import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Replicate from "https://esm.sh/replicate@0.25.2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    if (!REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not set')
    }

    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    });

    const { prompt } = await req.json()
    console.log("Received prompt:", prompt)

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Missing prompt" }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    console.log("Starting image generation with prompt:", prompt)
    
    // Create a prediction using the deployments API
    let prediction = await replicate.deployments.predictions.create(
      "koxei",  // owner
      "test1",  // deployment name
      {
        input: {
          prompt: prompt,
          negative_prompt: "bad quality, worst quality, low quality, normal quality, lowres, low resolution, blurry, text, watermark, signature, error"
        }
      }
    );

    // Wait for the prediction to complete
    console.log("Waiting for prediction to complete...");
    prediction = await replicate.wait(prediction);
    console.log("Prediction completed:", prediction);

    return new Response(
      JSON.stringify({ output: prediction.output }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error("Error:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})