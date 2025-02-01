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
    const output = await replicate.run(
      "ciekawe320/aniverse-pony-xl", // Your model's identifier
      {
        input: {
          prompt: prompt,
          negative_prompt: "bad quality, worst quality, low quality, normal quality, lowres, low resolution, blurry, text, watermark, signature, error",
          num_inference_steps: 30,
          guidance_scale: 7.5,
          width: 512,
          height: 512,
          num_outputs: 1
        }
      }
    );

    console.log("Generation completed:", output)
    return new Response(
      JSON.stringify({ output }),
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