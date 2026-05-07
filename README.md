# CrowdWatcher

CrowdWatcher is a Vite + React app that uses Gemini to generate crowd/zone analysis for any location and can send **SMS notifications** via **Twilio**.

## Prerequisites

- Node.js (recommended: 18+)
- A Gemini API key
- A Twilio account (trial works)

## Setup

1) Install dependencies

```bash
npm install
```

2) Configure environment variables

Copy `.env.example` to `.env` (or edit your existing `.env`) and fill:

- **Gemini**
  - `GEMINI_API_KEY`
- **Twilio (SMS)**
  - `TWILIO_ACCOUNT_SID` (Live SID, starts with `AC...`)
  - `TWILIO_AUTH_TOKEN` (Live token)
  - `TWILIO_FROM_NUMBER` (your Twilio phone number, e.g. `+18166407709`)
  - `APP_NAME` (optional)

## Running locally

This project runs:
- Frontend (Vite): `http://localhost:3000`
- Backend (Express API for Twilio): `http://localhost:3001`

Start the backend (Terminal 1):

```bash
npm run dev:server
```

Start the frontend (Terminal 2):

```bash
npm run dev
```

## Using SMS notifications (Twilio)

In the UI, click **Get notification**, enter a phone number, and click **Send**.

- You can enter either:
  - `9301506130` (auto-converted to `+919301506130`)
  - `+919301506130` (E.164 format)

### Twilio Trial Account Notes

On a Twilio trial account, you can only send SMS to **verified** recipient numbers.

1) Verify your personal number in Twilio:
- Twilio Console → Phone Numbers → Manage → **Verified Caller IDs**

2) If sending to India (`+91`), you may need to enable Geo Permissions:
- Twilio Console → Messaging → Settings → **Geo Permissions** → enable **India (SMS)**

## API endpoints

- `GET /api/health` (backend health check)
- `POST /api/notify`
  - Body: `{ "to": "+91xxxxxxxxxx", "message": "..." }`
  - If `message` is omitted, a default message is used.
