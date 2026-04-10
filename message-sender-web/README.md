# Business Message Sender Web App

A free and fast automatic message sender web application built with Next.js for your business.

## Features

- ✅ **Free** - Uses your Gmail account (no paid services required)
- ✅ **Fast** - Built with Next.js for optimal performance
- ✅ **Beautiful UI** - Modern, responsive design with Tailwind CSS
- ✅ **Templates** - Pre-built templates for common business messages
- ✅ **Batch Sending** - Send to multiple recipients at once
- ✅ **Progress Tracking** - Real-time progress indicator
- ✅ **Rate Limiting** - Built-in delays to avoid spam filters

## Quick Start

### 1. Install Dependencies

```bash
cd message-sender-web
npm install
```

### 2. Configure Email

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Gmail credentials:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Getting Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Enable 2FA if not already enabled
3. Create an app password for "Mail"
4. Copy the password and paste it in `.env.local`

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Add Recipients**: Enter email addresses (one per line)
2. **Choose Template**: Click on a template button or write your own message
3. **Send**: Click "Send Messages" to start sending

## Available Templates

- **Welcome** - Greet new customers
- **Reminder** - Send appointment reminders
- **Promotion** - Share special offers
- **Follow-up** - Check in with customers

## Production Build

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EMAIL_USER` | Your Gmail address | Yes |
| `EMAIL_PASS` | Gmail App Password | Yes |
| `SENDER_NAME` | Custom sender name | No |

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Email**: Nodemailer
- **Deployment**: Vercel (recommended)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

## Important Notes

⚠️ **Gmail Limits**: 
- Free Gmail accounts have a limit of 500 emails per day
- Consider using Google Workspace for higher limits

⚠️ **Best Practices**:
- Don't send too many emails at once
- Use meaningful subject lines
- Include an unsubscribe option for marketing emails
- Follow anti-spam laws in your region

## License

MIT License - Feel free to use for your business!
