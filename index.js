/**
 * Automatic Message Sender for Business
 * Free and Fast - Supports Email, WhatsApp, and SMS
 * 
 * Configuration: Set environment variables or edit the config object below
 */

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configuration - Edit these values for your business
const config = {
  // Email Configuration (Free with Gmail, Outlook, etc.)
  email: {
    enabled: true,
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  },
  
  // WhatsApp Configuration (Free via WhatsApp Business API or Twilio free tier)
  whatsapp: {
    enabled: false,
    apiKey: process.env.WHATSAPP_API_KEY || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_ID || ''
  },
  
  // SMS Configuration (Free trials available via Twilio, TextNow, etc.)
  sms: {
    enabled: false,
    accountSid: process.env.TWILIO_SID || '',
    authToken: process.env.TWILIO_TOKEN || '',
    fromNumber: process.env.TWILIO_NUMBER || ''
  },
  
  // Message Templates
  templates: {
    welcome: 'Hello {{name}}, welcome to {{business}}! We\'re excited to have you.',
    reminder: 'Hi {{name}}, this is a reminder about your appointment on {{date}}.',
    promotion: 'Special offer for {{name}}! Get {{discount}} off at {{business}}. Valid until {{expiry}}.',
    followup: 'Hi {{name}}, thank you for choosing {{business}}. How was your experience?'
  },
  
  // Recipient List (can also load from CSV/JSON file)
  recipients: [
    { name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
    { name: 'Jane Smith', email: 'jane@example.com', phone: '+0987654321' }
  ]
};

// Message Queue for batch sending
class MessageQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }
  
  add(message) {
    this.queue.push(message);
    console.log(`✓ Message added to queue: ${message.to}`);
    if (!this.processing) {
      this.process();
    }
  }
  
  async process() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }
    
    this.processing = true;
    const message = this.queue.shift();
    
    try {
      await this.send(message);
      console.log(`✓ Sent successfully to ${message.to}`);
    } catch (error) {
      console.error(`✗ Failed to send to ${message.to}:`, error.message);
    }
    
    // Small delay to avoid rate limiting
    setTimeout(() => this.process(), 1000);
  }
  
  async send(message) {
    switch (message.channel) {
      case 'email':
        await sendEmail(message);
        break;
      case 'whatsapp':
        await sendWhatsApp(message);
        break;
      case 'sms':
        await sendSMS(message);
        break;
      default:
        throw new Error(`Unknown channel: ${message.channel}`);
    }
  }
}

// Email Sender using Nodemailer
async function sendEmail(message) {
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: config.email.auth
  });
  
  const mailOptions = {
    from: `"${config.email.auth.user}" <${config.email.auth.user}>`,
    to: message.to,
    subject: message.subject || 'Message from Our Business',
    text: message.body,
    html: message.html || `<p>${message.body.replace(/\n/g, '<br>')}</p>`
  };
  
  await transporter.sendMail(mailOptions);
}

// WhatsApp Sender (placeholder - integrate with WhatsApp Business API)
async function sendWhatsApp(message) {
  if (!config.whatsapp.enabled) {
    console.log('WhatsApp not configured. Simulating send...');
    return Promise.resolve();
  }
  
  // Example: Using WhatsApp Cloud API
  const response = await fetch(
    `https://graph.facebook.com/v17.0/${config.whatsapp.phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.whatsapp.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: message.to,
        type: 'text',
        text: { body: message.body }
      })
    }
  );
  
  if (!response.ok) {
    throw new Error(`WhatsApp API error: ${response.statusText}`);
  }
}

// SMS Sender (placeholder - integrate with Twilio or similar)
async function sendSMS(message) {
  if (!config.sms.enabled) {
    console.log('SMS not configured. Simulating send...');
    return Promise.resolve();
  }
  
  // Example: Using Twilio
  // const twilio = require('twilio');
  // const client = twilio(config.sms.accountSid, config.sms.authToken);
  // await client.messages.create({
  //   body: message.body,
  //   from: config.sms.fromNumber,
  //   to: message.to
  // });
  
  console.log(`SMS would be sent to ${message.to}: ${message.body}`);
}

// Template Processor
function processTemplate(templateName, variables) {
  let template = config.templates[templateName];
  if (!template) {
    throw new Error(`Template not found: ${templateName}`);
  }
  
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] || match;
  });
}

// Load recipients from file
function loadRecipientsFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  if (ext === '.json') {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } else if (ext === '.csv') {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const recipient = {};
      headers.forEach((header, index) => {
        recipient[header] = values[index];
      });
      return recipient;
    });
  }
  
  throw new Error(`Unsupported file format: ${ext}`);
}

// Main function to send bulk messages
async function sendBulkMessages(options = {}) {
  const {
    channel = 'email',
    template = 'welcome',
    variables = {},
    recipients = config.recipients,
    subject = 'Message from Our Business'
  } = options;
  
  const queue = new MessageQueue();
  
  console.log(`\n🚀 Starting bulk message send via ${channel}...`);
  console.log(`📝 Using template: ${template}`);
  console.log(`👥 Recipients: ${recipients.length}\n`);
  
  for (const recipient of recipients) {
    const mergedVars = { ...recipient, ...variables };
    const body = processTemplate(template, mergedVars);
    
    queue.add({
      channel,
      to: recipient[channel === 'email' ? 'email' : 'phone'],
      subject,
      body
    });
  }
  
  // Wait for queue to finish
  while (queue.processing || queue.queue.length > 0) {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n✅ All messages processed!\n');
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const channelArg = args.find(arg => arg.startsWith('--channel='));
  const channel = channelArg ? channelArg.split('=')[1] : 'email';
  
  console.log('📬 Automatic Message Sender');
  console.log('===========================\n');
  
  // Demo mode - replace with your actual configuration
  const demoRecipients = [
    { name: 'Valued Customer', email: 'demo@example.com', phone: '+1234567890' }
  ];
  
  sendBulkMessages({
    channel,
    template: 'welcome',
    variables: { business: 'Your Business Name', discount: '20%', expiry: 'Dec 31, 2024' },
    recipients: demoRecipients
  }).catch(console.error);
}

// Export for programmatic use
module.exports = {
  sendBulkMessages,
  sendEmail,
  sendWhatsApp,
  sendSMS,
  processTemplate,
  loadRecipientsFromFile,
  MessageQueue,
  config
};