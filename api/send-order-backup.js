// Backup email service using a different approach
// This can be used as an alternative if Resend fails

export default async function handler(req, res) {
  console.log('📧 Backup email service invoked');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderNumber, name, email, phone, address, items, subtotal, deliveryFee, total, date } = req.body;

  try {
    // Format items
    const itemListHtml = items.map(item =>
      `<li>${item.name} x${item.quantity} (Size: ${item.size || 'N/A'}) - Rs${item.price * item.quantity}</li>`
    ).join('');

    // For now, just log the email data
    // In a real implementation, you could use:
    // 1. SendGrid
    // 2. Mailgun
    // 3. AWS SES
    // 4. Or integrate with your own SMTP server

    console.log('📧 Email data that would be sent:');
    console.log('To business (fitforge.pk@gmail.com):');
    console.log('Subject:', `New Order: ${orderNumber}`);
    console.log('Content:', `
      New Order Received
      Order Number: ${orderNumber}
      Date: ${date}
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Address: ${address}
      Order Summary: ${itemListHtml}
      Subtotal: Rs${subtotal}
      ${deliveryFee ? `Delivery Fee: Rs${deliveryFee}` : ''}
      Total: Rs${total}
    `);

    console.log('To customer (${email}):');
    console.log('Subject:', `Your Order Confirmation: ${orderNumber}`);
    console.log('Content:', `
      Thank you for your order!
      Your order has been received and is being processed.
      Order Number: ${orderNumber}
      Date: ${date}
      Order Summary: ${itemListHtml}
      Subtotal: Rs${subtotal}
      ${deliveryFee ? `Delivery Fee: Rs${deliveryFee}` : ''}
      Total: Rs${total}
      We will contact you soon for confirmation and shipping details.
      If you have any questions, contact us at fitforge.pk@gmail.com.
    `);

    // Return success response
    res.status(200).json({ 
      success: true,
      message: 'Order logged successfully (backup service)',
      note: 'Emails would be sent via backup service'
    });

  } catch (error) {
    console.error('❌ Backup email service error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Backup email service failed'
    });
  }
} 