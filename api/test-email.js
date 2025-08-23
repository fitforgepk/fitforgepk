import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  console.log('🧪 Test email function invoked');
  console.log('🔑 API Key available:', !!process.env.RESEND_API_KEY);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { testEmail } = req.body;

  if (!testEmail || !testEmail.includes('@')) {
    return res.status(400).json({ error: 'Please provide a valid test email address' });
  }

  try {
    console.log('📧 Sending test email to:', testEmail);

    const testData = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use Resend's default domain for testing
      to: [testEmail],
      subject: 'Test Email from FitForge',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email to verify that the email service is working correctly.</p>
        <p><b>Time:</b> ${new Date().toISOString()}</p>
        <p><b>Environment:</b> ${process.env.NODE_ENV || 'development'}</p>
        <p>If you receive this email, the email service is working properly.</p>
      `,
    });

    console.log('✅ Test email result:', testData);

    if (testData.error) {
      console.error('❌ Test email error:', testData.error);
      return res.status(500).json({ 
        error: testData.error,
        message: 'Test email failed'
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Test email sent successfully',
      data: testData
    });

  } catch (error) {
    console.error('❌ Test email error:', error);
    res.status(500).json({ 
      error: error.message,
      message: 'Test email failed'
    });
  }
} 