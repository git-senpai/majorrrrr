import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Twilio from 'twilio';

const PORT = Number(process.env.PORT ?? 3001);

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM_NUMBER,
  APP_NAME = 'CrowdWatcher',
} = process.env;

const hasTwilioConfig =
  !!TWILIO_ACCOUNT_SID && !!TWILIO_AUTH_TOKEN && !!TWILIO_FROM_NUMBER;

const app = express();
app.use(cors());
app.use(express.json({ limit: '64kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/notify', async (req, res) => {
  if (!hasTwilioConfig) {
    return res.status(500).json({
      error: 'Twilio is not configured',
      details:
        'Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER in .env, then restart the server.',
    });
  }

  const to = String(req.body?.to ?? '').trim();
  const message = String(req.body?.message ?? '').trim();

  if (!to) return res.status(400).json({ error: '`to` is required' });

  const body =
    message ||
    `Hi from ${APP_NAME}! You will get updates if the crowd changes near your selected location.`;

  try {
    const twilio = Twilio(TWILIO_ACCOUNT_SID!, TWILIO_AUTH_TOKEN!);
    const result = await twilio.messages.create({
      to,
      from: TWILIO_FROM_NUMBER!,
      body,
    });

    res.json({ sid: result.sid });
  } catch (err: any) {
    res.status(500).json({
      error: 'Failed to send SMS',
      details: err?.message ?? String(err),
    });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] listening on http://localhost:${PORT}`);
  if (!hasTwilioConfig) {
    console.log(
      '[server] Twilio not configured yet. Fill TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER in .env',
    );
  }
});

