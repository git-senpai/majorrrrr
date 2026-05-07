require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

// Credentials for WhatsApp notifications
const whatsappAccountSid = process.env.WHATSAPP_ACCOUNT_SID;
const whatsappAuthToken = process.env.WHATSAPP_AUTH_TOKEN;
const whatsappFromNumber = process.env.WHATSAPP_FROM_NUMBER;
const twilioWhatsAppClient = (whatsappAccountSid && whatsappAuthToken) ? twilio(whatsappAccountSid, whatsappAuthToken) : null;

// Credentials for SMS notifications
const smsAccountSid = process.env.SMS_ACCOUNT_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;
const smsFromNumber = process.env.SMS_FROM_NUMBER;
const twilioSmsClient = (smsAccountSid && smsAuthToken) ? twilio(smsAccountSid, smsAuthToken) : null;

app.post('/api/send-whatsapp', async (req, res) => {
    try {
        if (!twilioWhatsAppClient) {
            return res.status(500).json({ error: 'WhatsApp Twilio client is not configured.' });
        }

        const { numbers, message } = req.body;

        if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
            return res.status(400).json({ error: 'Please provide an array of phone numbers.' });
        }

        const results = [];
        for (const number of numbers) {
            const formattedNumber = number.startsWith('+') ? number : `+${number}`;
            const fromWhatsApp = whatsappFromNumber.startsWith('whatsapp:') ? whatsappFromNumber : `whatsapp:${whatsappFromNumber}`;
            const toWhatsApp = `whatsapp:${formattedNumber}`;
            
            try {
                const response = await twilioWhatsAppClient.messages.create({
                    body: message || 'Alert from Crowd System',
                    from: fromWhatsApp,
                    to: toWhatsApp
                });
                results.push({ number: formattedNumber, status: 'success', sid: response.sid });
            } catch (err) {
                results.push({ number: formattedNumber, status: 'failed', error: err.message });
            }
        }

        res.json({ success: true, results });
    } catch (error) {
        console.error('Error sending WhatsApp:', error);
        res.status(500).json({ error: error.message || 'Failed to send messages.' });
    }
});

app.post('/api/notify', async (req, res) => {
    try {
        if (!twilioSmsClient) {
            return res.status(500).json({ error: 'Twilio SMS client is not configured.' });
        }

        const to = String(req.body?.to ?? '').trim();
        const message = String(req.body?.message ?? '').trim();

        if (!to) return res.status(400).json({ error: '`to` is required' });

        const body = message || 'Hi from CrowdWatcher! You will get updates if the crowd changes near your selected location.';

        const result = await twilioSmsClient.messages.create({
            to,
            from: smsFromNumber,
            body,
        });

        res.json({ sid: result.sid });
    } catch (err) {
        console.error('Error sending SMS notify:', err);
        res.status(500).json({ error: 'Failed to send SMS', details: err.message });
    }
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
});