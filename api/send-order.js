import { Resend } from 'resend';

// Check if API key is available
if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY is not set in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  console.log('📧 send-order function invoked');
  console.log('🔑 API Key available:', !!process.env.RESEND_API_KEY);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orderNumber, name, email, phone, address, items, subtotal, deliveryFee, total, date, bankProof } = req.body;

  console.log('📦 Order data received:', { 
    orderNumber, 
    name, 
    email, 
    phone, 
    address, 
    itemsCount: items?.length,
    total, 
    date,
    bankProof
  });

  // ✅ Enhanced validation
  if (!orderNumber || !email || !Array.isArray(items) || items.length === 0) {
    console.error('❌ Validation failed:', { orderNumber, email, items });
    return res.status(400).json({ error: 'Missing or invalid order data' });
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    console.error('❌ Invalid email format:', email);
    return res.status(400).json({ error: 'Invalid customer email address' });
  }

  try {
    // ✅ Format items
    const itemListHtml = items.map(item =>
      `<li>${item.name} x${item.quantity} (Size: ${item.size || 'N/A'}) - Rs${item.price * item.quantity}</li>`
    ).join('');

    // ✅ Use verified sender email address - try multiple options
    let verifiedSender;
    if (process.env.NODE_ENV === 'production') {
      verifiedSender = 'FitForge <orders@fitforgepk.com>'; // Use verified domain
    } else {
      // For development/testing, use Resend's default domain
      verifiedSender = 'onboarding@resend.dev';
    }

    console.log('📧 Sending emails with sender:', verifiedSender);

    // Send to business (fitforge.pk@gmail.com)
    console.log('📧 Sending business email to: fitforge.pk@gmail.com');
    const businessData = await resend.emails.send({
      from: verifiedSender,
      to: ['fitforge.pk@gmail.com'],
      subject: `New Order: ${orderNumber}`,
      html: `
        <h2>New Order Received</h2>
        <p><b>Order Number:</b> ${orderNumber}</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Address:</b> ${address}</p>
        <h3>Order Summary</h3>
        <ul>${itemListHtml}</ul>
        <p><b>Subtotal:</b> Rs${subtotal}</p>
        ${deliveryFee ? `<p><b>Delivery Fee:</b> Rs${deliveryFee}</p>` : ''}
        <p><b>Total:</b> Rs${total}</p>
        ${bankProof ? `<p><b>Payment Reference:</b> ${bankProof}</p>` : ''}
      `,
    });

    console.log('✅ Business email result:', businessData);

    // Send to customer with better error handling
    console.log('📧 Sending customer email to:', email);
    let customerData;
    try {
      customerData = await resend.emails.send({
        from: verifiedSender,
        to: [email],
        subject: `Your Order Confirmation: ${orderNumber}`,
        html: `
          <h2>Thank you for your order!</h2>
          <p>Your order has been received and is being processed.</p>
          <p><b>Order Number:</b> ${orderNumber}</p>
          <p><b>Date:</b> ${date}</p>
          <h3>Order Summary</h3>
          <ul>${itemListHtml}</ul>
          <p><b>Subtotal:</b> Rs${subtotal}</p>
          ${deliveryFee ? `<p><b>Delivery Fee:</b> Rs${deliveryFee}</p>` : ''}
          <p><b>Total:</b> Rs${total}</p>
          ${bankProof ? `<p><b>Payment Reference:</b> ${bankProof}</p>` : ''}
          <p>We will contact you soon for confirmation and shipping details.</p>
          <p>If you have any questions, reply to this email or contact us at fitforge.pk@gmail.com.</p>
        `,
      });
      console.log('✅ Customer email result:', customerData);
    } catch (customerError) {
      console.error('❌ Customer email failed:', customerError);
      // Try alternative sender for customer email
      try {
        customerData = await resend.emails.send({
          from: 'onboarding@resend.dev', // Use Resend's default domain as fallback
          to: [email],
          subject: `Your Order Confirmation: ${orderNumber}`,
          html: `
            <h2>Thank you for your order!</h2>
            <p>Your order has been received and is being processed.</p>
            <p><b>Order Number:</b> ${orderNumber}</p>
            <p><b>Date:</b> ${date}</p>
            <h3>Order Summary</h3>
            <ul>${itemListHtml}</ul>
            <p><b>Subtotal:</b> Rs${subtotal}</p>
            ${deliveryFee ? `<p><b>Delivery Fee:</b> Rs${deliveryFee}</p>` : ''}
            <p><b>Total:</b> Rs${total}</p>
            <p>We will contact you soon for confirmation and shipping details.</p>
            <p>If you have any questions, contact us at fitforge.pk@gmail.com.</p>
          `,
        });
        console.log('✅ Customer email sent with fallback sender:', customerData);
      } catch (fallbackError) {
        console.error('❌ Fallback customer email also failed:', fallbackError);
        customerData = { error: fallbackError.message };
      }
    }

    // Check for errors in responses
    if (businessData.error) {
      console.error('❌ Business email error:', businessData.error);
    }
    if (customerData.error) {
      console.error('❌ Customer email error:', customerData.error);
    }

    // Return success even if customer email fails, but log the issue
    const success = !businessData.error;
    const customerSuccess = !customerData.error;

    res.status(200).json({ 
      success: success,
      business: businessData, 
      customer: customerData,
      customerSuccess: customerSuccess,
      message: success ? 'Order processed successfully' : 'Order processing failed',
      customerMessage: customerSuccess ? 'Customer email sent' : 'Customer email failed'
    });

  } catch (error) {
    console.error('❌ Resend error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'Email sending failed. Check server logs for more details.'
    });
  }
}
