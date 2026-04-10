'use client';

import { useState } from 'react';

interface MessageData {
  to: string;
  subject: string;
  message: string;
}

interface SendResult {
  success: boolean;
  message: string;
}

export default function MessageSender() {
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const templates = {
    welcome: {
      subject: 'Welcome to Our Business!',
      message: 'Dear Customer,\n\nWelcome to our business! We are excited to have you on board.\n\nBest regards,\nThe Team'
    },
    reminder: {
      subject: 'Friendly Reminder',
      message: 'Dear Customer,\n\nThis is a friendly reminder about your upcoming appointment.\n\nBest regards,\nThe Team'
    },
    promotion: {
      subject: 'Special Offer Just for You!',
      message: 'Dear Customer,\n\nWe have an exclusive offer just for you! Get 20% off on your next purchase.\n\nBest regards,\nThe Team'
    },
    followup: {
      subject: 'Following Up',
      message: 'Dear Customer,\n\nWe wanted to follow up on your recent experience with us.\n\nBest regards,\nThe Team'
    }
  };

  const loadTemplate = (type: keyof typeof templates) => {
    setSubject(templates[type].subject);
    setMessage(templates[type].message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setResult(null);
    setProgress({ current: 0, total: 0 });

    const recipientList = recipients.split('\n').filter(r => r.trim());

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: recipientList,
          subject,
          message
        })
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: `Successfully sent ${data.sent} messages!`
        });
        setProgress({ current: data.sent, total: recipientList.length });
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to send messages'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error. Please try again.'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📧 Business Message Sender
          </h1>
          <p className="text-lg text-gray-600">
            Free and fast automatic email sender for your business
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipients */}
            <div>
              <label htmlFor="recipients" className="block text-sm font-medium text-gray-700 mb-2">
                Recipients (one email per line)
              </label>
              <textarea
                id="recipients"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="customer1@example.com&#10;customer2@example.com&#10;customer3@example.com"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                required
              />
            </div>

            {/* Templates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Templates
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(templates).map((template) => (
                  <button
                    key={template}
                    type="button"
                    onClick={() => loadTemplate(template as keyof typeof templates)}
                    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors capitalize text-sm font-medium"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            {/* Progress */}
            {progress.total > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between text-sm text-blue-700 mb-2">
                  <span>Progress</span>
                  <span>{progress.current} / {progress.total}</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Result */}
            {result && (
              <div className={`rounded-lg p-4 ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <p className="font-medium">{result.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSending}
              className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg transition-all transform hover:scale-[1.02] ${
                isSending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg'
              }`}
            >
              {isSending ? 'Sending...' : '🚀 Send Messages'}
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📝 How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Add recipient emails (one per line)</li>
            <li>Choose a template or write your own message</li>
            <li>Click &quot;Send Messages&quot; to start sending</li>
          </ol>
          
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Note:</strong> Configure your email credentials in the <code className="bg-yellow-100 px-2 py-1 rounded">.env.local</code> file:
              <br />
              <code className="block mt-2 bg-yellow-100 p-2 rounded text-xs">
                EMAIL_USER=your-email@gmail.com<br />
                EMAIL_PASS=your-app-password
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
