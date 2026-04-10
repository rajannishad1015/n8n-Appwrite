import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface EmailRequest {
  recipients: string[];
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json();
    const { recipients, subject, message } = body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one recipient' },
        { status: 400 }
      );
    }

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let sentCount = 0;
    const errors: string[] = [];

    // Send emails one by one with rate limiting
    for (const recipient of recipients) {
      try {
        await transporter.sendMail({
          from: `"${process.env.EMAIL_USER || 'Business'}" <${process.env.EMAIL_USER || 'noreply@example.com'}>`,
          to: recipient.trim(),
          subject: subject,
          text: message,
          html: message.replace(/\n/g, '<br>'),
        });
        sentCount++;
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to send to ${recipient}:`, error);
        errors.push(recipient);
      }
    }

    if (sentCount === 0) {
      return NextResponse.json(
        { error: 'Failed to send any messages', details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sent: sentCount,
      total: recipients.length,
      failed: errors,
      message: `Successfully sent ${sentCount}/${recipients.length} messages`
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
