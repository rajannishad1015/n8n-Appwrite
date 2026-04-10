# 📬 Automatic Message Sender for Business

A **free and fast** automatic message sender designed for businesses to send bulk messages via Email, WhatsApp, and SMS.

## ✨ Features

- **Multi-Channel Support**: Send messages via Email, WhatsApp, or SMS
- **Template System**: Pre-built templates for welcome messages, reminders, promotions, and follow-ups
- **Batch Processing**: Queue-based system for reliable bulk sending
- **CSV/JSON Import**: Load recipient lists from external files
- **Environment Variables**: Secure configuration via environment variables
- **Rate Limiting Protection**: Built-in delays to avoid API rate limits
- **Free to Use**: Uses free tiers of popular services (Gmail SMTP, WhatsApp Business API free tier, etc.)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Your Settings

Edit `index.js` or set environment variables:

```bash
export EMAIL_USER="your-email@gmail.com"
export EMAIL_PASS="your-app-password"
```

### 3. Run the Sender

```bash
# Send emails
npm start

# Or specify channel
npm run send-email
npm run send-whatsapp
npm run send-sms
```

## 📝 Configuration

### Email Setup (Free with Gmail)

1. Enable 2FA on your Google account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Update config in `index.js`:

```javascript
email: {
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
}
```

### WhatsApp Setup (Free Tier Available)

1. Create a [Meta Developer Account](https://developers.facebook.com/)
2. Set up WhatsApp Business Platform
3. Get your Phone Number ID and API Key
4. Update config:

```javascript
whatsapp: {
  enabled: true,
  apiKey: 'your-api-key',
  phoneNumberId: 'your-phone-number-id'
}
```

### SMS Setup (Free Trial Available)

1. Sign up for [Twilio](https://www.twilio.com/) (free trial available)
2. Get your Account SID, Auth Token, and Phone Number
3. Update config:

```javascript
sms: {
  enabled: true,
  accountSid: 'your-account-sid',
  authToken: 'your-auth-token',
  fromNumber: '+1234567890'
}
```

## 📋 Usage Examples

### Programmatic Usage

```javascript
const { sendBulkMessages, processTemplate } = require('./index');

// Send welcome emails
await sendBulkMessages({
  channel: 'email',
  template: 'welcome',
  variables: { business: 'My Business' },
  recipients: [
    { name: 'John', email: 'john@example.com' },
    { name: 'Jane', email: 'jane@example.com' }
  ]
});

// Use custom template
const message = processTemplate('promotion', {
  name: 'Customer',
  discount: '20%',
  business: 'My Store',
  expiry: 'Dec 31'
});
```

### Load Recipients from File

```javascript
const { loadRecipientsFromFile, sendBulkMessages } = require('./index');

// From CSV
const recipients = loadRecipientsFromFile('customers.csv');

// From JSON
const recipients = loadRecipientsFromFile('customers.json');

await sendBulkMessages({
  channel: 'email',
  template: 'reminder',
  recipients
});
```

### CSV Format Example

```csv
name,email,phone
John Doe,john@example.com,+1234567890
Jane Smith,jane@example.com,+0987654321
```

### JSON Format Example

```json
[
  { "name": "John Doe", "email": "john@example.com", "phone": "+1234567890" },
  { "name": "Jane Smith", "email": "jane@example.com", "phone": "+0987654321" }
]
```

## 🎯 Available Templates

- `welcome` - Welcome new customers
- `reminder` - Appointment reminders
- `promotion` - Special offers and discounts
- `followup` - Post-purchase follow-up

Create custom templates by adding to the `templates` object in config.

## ⚡ Performance Tips

1. **Use Environment Variables** for sensitive data
2. **Batch Large Lists** - Process in groups of 100-500 recipients
3. **Schedule Sends** - Use cron jobs for automated campaigns
4. **Monitor Rate Limits** - Adjust delays based on your provider

## 🔒 Security Best Practices

- Never commit credentials to version control
- Use `.env` files with `dotenv` package for production
- Rotate API keys regularly
- Enable 2FA on all accounts

## 🆓 Free Service Options

| Channel | Free Option | Limits |
|---------|-------------|--------|
| Email | Gmail SMTP | 500 emails/day |
| WhatsApp | WhatsApp Business API | 1,000 conversations/month |
| SMS | Twilio Trial | $15 credit (~1000 SMS) |

## 📞 Support

For issues or questions:
1. Check the configuration settings
2. Verify API credentials are correct
3. Review error messages in console output
4. Check provider documentation for API changes

## 📄 License

ISC License - Free for personal and commercial use

---

**Built with ❤️ for small businesses**
