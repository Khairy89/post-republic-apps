
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Parsed body from request:", body);

    // Add clear check for missing orderData
    if (!body || !body.orderData) {
      console.error("Edge Function Error: orderData is missing from request body. Received body:", body);
      return new Response(
        JSON.stringify({
          success: false,
          error: "orderData missing in request body. Make sure to send { orderData: { ... } }"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const { orderData } = body;

    // Expect orderData to use camelCase keys everywhere
    const message = `
🧾 *PostRepublic Invoice Request*

📦 *Package Details:*
• Recipient: ${orderData.recipientName}
• Destination: ${orderData.city}, ${orderData.state}, ${orderData.country}
• Weight: ${orderData.actualWeight}kg (Chargeable: ${orderData.chargeableWeight}kg)
• Dimensions: ${orderData.length}×${orderData.width}×${orderData.height}cm

💰 *Pricing Breakdown:*
• Base Rate: RM${orderData.basePrice?.toFixed(2)}
• Fuel Surcharge: RM${orderData.fuelSurcharge?.toFixed(2)}
• Handling Fee: RM${orderData.handlingFee?.toFixed(2)}
${orderData.repacking ? `• Repacking: RM${orderData.repackingFee?.toFixed(2)}` : ''}
• *Total: RM${orderData.totalPrice?.toFixed(2)}*

📧 Customer Email: ${orderData.userEmail || 'Not provided'}
📱 Customer Phone: ${orderData.phone}

Order ID: ${orderData.orderId}
Time: ${new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/60148478701?text=${encodedMessage}`;

    console.log("WhatsApp invoice sent for order:", orderData.orderId);

    return new Response(
      JSON.stringify({
        success: true,
        whatsappUrl,
        message: "Invoice details prepared for WhatsApp"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error sending WhatsApp invoice:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
