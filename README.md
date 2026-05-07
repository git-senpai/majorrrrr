# CrowdWatcher: Intelligent Crowd Sourced Management System

CrowdWatcher is a high-performance, AI-driven crowd management platform that leverages **Google Gemini AI** for real-time predictive modeling and **Twilio** for multi-channel alerting (WhatsApp & SMS).

## 🚀 Key Features

- **AI Predictive Modeling**: Generates 24-hour crowd density forecasts using Gemini-1.5-Flash.
- **Dynamic Visualizations**: High-fidelity charts for movement speed, risk factors, and density over time.
- **Multi-Channel Alerts**: 
  - **WhatsApp**: Detailed temporal analysis reports sent via Twilio WhatsApp API.
  - **SMS**: Instant emergency broadcast notifications.
- **Interactive Crowd Maps**: Zone-based telemetry with risk indicators and zone-specific descriptions.
- **Intelligent Assistant**: Context-aware AI chatbot to answer safety and logistics queries.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Recharts, Lucide-React, Framer Motion.
- **Backend**: Node.js, Express, Twilio SDK, Dotenv.
- **AI**: Google Generative AI (Gemini).

## 📂 Project Structure

- `/src`: Frontend React application.
- `/backend`: Node.js Express server for Twilio integrations.

## ⚙️ Setup & Configuration

### 1. Installation

Install dependencies for both the root project and the backend:

```bash
# Root dependencies
npm install

# Backend dependencies
cd backend && npm install
cd ..
```

### 2. Environment Variables

Create the following files and fill in your credentials:

#### **Root Directory (`.env.local`)**
```env
GEMINI_API_KEY=your_gemini_api_key
VITE_BACKEND_URL=http://localhost:5000
```

#### **Backend Directory (`backend/.env`)**
```env
# WhatsApp Configuration (Sandbox)
WHATSAPP_ACCOUNT_SID=your_whatsapp_sid
WHATSAPP_AUTH_TOKEN=your_whatsapp_token
WHATSAPP_FROM_NUMBER=+14155238886

# SMS Configuration (Live)
SMS_ACCOUNT_SID=your_sms_sid
SMS_AUTH_TOKEN=your_sms_token
SMS_FROM_NUMBER=your_twilio_phone_number

APP_NAME=CrowdWatcher
```

## 🏃 Running the Application

You need to run both the frontend and the backend simultaneously.

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

### Terminal 2: Frontend
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## 📱 WhatsApp Sandbox Setup

To receive WhatsApp alerts during development:
1. Send a WhatsApp message to `+1 415 523 8886` with the code provided in your Twilio Sandbox Console (e.g., `join smooth-apple`).
2. Once you receive the "You are all set!" reply, you can send alerts from the dashboard.

## 📡 API Endpoints (Backend)

- `POST /api/send-whatsapp`: Sends detailed crowd analysis reports.
- `POST /api/notify`: Sends quick SMS notifications.

---
Built with ❤️ for a safer, smarter world.
