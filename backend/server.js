require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

// Set these in your .env.local file or server environment
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'your_twilio_account_sid';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'your_twilio_auth_token';
const twilioFromNumber = process.env.TWILIO_FROM_NUMBER || '+12345678901';
const twilioClient = accountSid !== 'your_twilio_account_sid' ? twilio(accountSid, authToken) : null;

app.post('/api/send-whatsapp', async (req, res) => {
    try {
        if (!twilioClient) {
            return res.status(500).json({ error: 'Twilio is not configured on the server.' });
        }

        const { numbers, message } = req.body;

        if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
            return res.status(400).json({ error: 'Please provide an array of phone numbers.' });
        }

        const results = [];
        for (const number of numbers) {
            const formattedNumber = number.startsWith('+') ? number : `+${number}`;
            const fromWhatsApp = twilioFromNumber.startsWith('whatsapp:') ? twilioFromNumber : `whatsapp:${twilioFromNumber}`;
            const toWhatsApp = `whatsapp:${formattedNumber}`;
            
            try {
                const response = await twilioClient.messages.create({
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

app.listen(5000, () => {
    console.log('Server started on port 5000');
});