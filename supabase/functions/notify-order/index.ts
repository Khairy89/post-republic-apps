
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
    const orderData = await req.json();
    console.log("New order notification received:", orderData);

    // Format the order notification message
    const message = `
🧾 *PostRepublic - New Order Alert!*

📦 *Order Details:*
• Order ID: ${orderData.orderId}
• Recipient: ${orderData.recipientName}
• Destination: ${orderData.city}, ${orderData.state}, ${orderData.country}
• Phone: ${orderData.phone}

📊 *Package Info:*
• Weight: ${orderData.weight}kg (Chargeable: ${orderData.chargeableWeight}kg)
• Total: RM${orderData.totalPrice?.toFixed(2)}

💰 *Pricing Breakdown:*
• Base Rate: RM${orderData.basePrice?.toFixed(2)}
• Fuel Surcharge: RM${orderData.fuelSurcharge?.toFixed(2)}
• Handling Fee: RM${orderData.handlingFee?.toFixed(2)}
${orderData.repackingFee > 0 ? `• Repacking: RM${orderData.repackingFee?.toFixed(2)}` : ''}

⏰ Time: ${new Date(orderData.createdAt).toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}

This order was automatically created and saved to your database.
    `.trim();

    // Send WhatsApp notification (you can replace this with email or other notification method)
    const whatsappNumber = "60148478701";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    console.log("Order notification processed successfully for order:", orderData.orderId);
    console.log("WhatsApp notification URL generated:", whatsappUrl);

    // For now, we'll log the notification. In production, you might want to:
    // 1. Send an email notification
    // 2. Use WhatsApp Business API to send directly
    // 3. Send to a Slack channel
    // 4. Store in a notifications table

    return new Response(
      JSON.stringify({
        success: true,
        message: "Order notification processed",
        orderId: orderData.orderId,
        whatsappUrl: whatsappUrl
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error processing order notification:", error);
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
