
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData = await req.json();
    console.log("New order notification received:", orderData);

    // Format the order notification message for WhatsApp
    const whatsappMessage = `
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

    // Create HTML email content
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Shipping Order - PostRepublic</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px; }
    .order-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .section { margin: 25px 0; }
    .section h3 { color: #667eea; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .info-item { padding: 10px 0; }
    .info-label { font-weight: bold; color: #555; }
    .info-value { color: #333; margin-top: 5px; }
    .price-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    .price-table th, .price-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    .price-table th { background-color: #f8f9fa; font-weight: bold; }
    .total-row { background-color: #e8f4f8; font-weight: bold; font-size: 16px; }
    .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
    .alert-badge { background: #ff6b6b; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="alert-badge">🚨 NEW ORDER ALERT</div>
      <h1>PostRepublic</h1>
      <p>International Shipping Order Notification</p>
    </div>
    
    <div class="content">
      <div class="order-info">
        <h2 style="margin-top: 0; color: #667eea;">Order ID: ${orderData.orderId}</h2>
        <p><strong>Created:</strong> ${new Date(orderData.createdAt).toLocaleString('en-MY', { 
          timeZone: 'Asia/Kuala_Lumpur',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>

      <div class="section">
        <h3>📦 Recipient Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Name:</div>
            <div class="info-value">${orderData.recipientName}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Phone:</div>
            <div class="info-value">${orderData.phone}</div>
          </div>
        </div>
        <div class="info-item">
          <div class="info-label">Destination:</div>
          <div class="info-value">${orderData.city}, ${orderData.state}, ${orderData.country}</div>
        </div>
      </div>

      <div class="section">
        <h3>📊 Package Details</h3>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Actual Weight:</div>
            <div class="info-value">${orderData.weight} kg</div>
          </div>
          <div class="info-item">
            <div class="info-label">Chargeable Weight:</div>
            <div class="info-value">${orderData.chargeableWeight} kg</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>💰 Pricing Breakdown</h3>
        <table class="price-table">
          <tr>
            <td>Base Shipping Rate</td>
            <td>RM ${orderData.basePrice?.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Fuel Surcharge</td>
            <td>RM ${orderData.fuelSurcharge?.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Handling Fee</td>
            <td>RM ${orderData.handlingFee?.toFixed(2)}</td>
          </tr>
          ${orderData.repackingFee > 0 ? `
          <tr>
            <td>Repacking Fee</td>
            <td>RM ${orderData.repackingFee?.toFixed(2)}</td>
          </tr>
          ` : ''}
          <tr class="total-row">
            <td><strong>Total Amount</strong></td>
            <td><strong>RM ${orderData.totalPrice?.toFixed(2)}</strong></td>
          </tr>
        </table>
      </div>
    </div>

    <div class="footer">
      <p>This order has been automatically saved to your database.</p>
      <p>Please log in to your admin panel to process this order.</p>
      <p style="margin-top: 20px; font-size: 12px; color: #999;">
        PostRepublic International Shipping Services
      </p>
    </div>
  </div>
</body>
</html>`;

    // Send email notification
    let emailResult = null;
    try {
      emailResult = await resend.emails.send({
        from: "PostRepublic <onboarding@resend.dev>",
        to: ["mk.developeer@gmail.com"],
        subject: `🚨 New Shipping Order - ${orderData.recipientName} (${orderData.country})`,
        html: emailHtml,
      });
      
      console.log("Email sent successfully:", emailResult);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Continue with WhatsApp generation even if email fails
    }

    // Generate WhatsApp notification URL (backup method)
    const whatsappNumber = "60148478701";
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    console.log("Order notification processed successfully for order:", orderData.orderId);
    console.log("WhatsApp notification URL generated:", whatsappUrl);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Order notification processed",
        orderId: orderData.orderId,
        emailSent: !!emailResult,
        emailId: emailResult?.id || null,
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
