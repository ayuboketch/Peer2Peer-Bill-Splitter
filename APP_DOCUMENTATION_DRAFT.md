## Peer-to-Peer Bill Splitting App Documentation

### 1. Introduction
This application enables a host to split a bill among multiple participants and collect individual payments via M-Pesa. Once collected, the app consolidates all shares and disburses a single payout to the vendor. Built with a full-stack JavaScript approach, the app uses React Native (mobile - Android & iOS), Node.js, Express.js, and Supabase for real-time data sync on rollout to be migrated later and React.js (for web: future update/release).

### 2. Key Features
- **Bill Creation & Itemization**: Create bills with equal, itemized, or custom splits.
- **Participant Management**: Invite users by phone number or deep link; track payment status.
- **M-Pesa Integration**: Trigger STK Push requests for each share, process callbacks, and aggregate payments.
- **Consolidated Payout**: Automatic B2C disbursement to vendor once all shares are collected.
- **Real-Time Updates**: Live status of payments via Supabase Realtime or Socket.io.
- **Notifications**: In-app alerts for payment success/failure and reminders.

### 3. Architecture Overview
#### 3.1 Frontend (Web & Mobile)
- **Web**: React.js SPA with Context API for state.
- **Mobile**: React Native (Expo) for iOS/Android.
- **UI**: Responsive design with Tailwind CSS or Material UI.

#### 3.2 Backend
- **API**: Node.js & Express.js RESTful endpoints.
- **Payment Services**: Daraja C2B (STK Push) and B2C APIs.
- **Database**: Supabase (PostgreSQL) for persistent storage and real-time subscriptions.

#### 3.3 Data Flow
1. Host creates bill → saved in Supabase.
2. Backend initiates STK Push for each participant.
3. Daraja sends payment callbacks → update transaction records.
4. Once all shares are paid → backend calls B2C to vendor.
5. Frontend receives real-time updates and notifies users.

### 4. Data Model
- **Users**: `id`, `name`, `phoneNumber`, `authProvider`.
- **Bills**: `id`, `hostUserId`, `totalAmount`, `tipPercent`, `createdAt`.
- **Participants**: `id`, `billId`, `userId`, `shareAmount`, `status`.
- **Transactions**: `id`, `participantId`, `checkoutRequestId`, `status`, `timestamp`.

### 5. API Endpoints
| Method | Endpoint                        | Description                          |
|--------|---------------------------------|--------------------------------------|
| POST   | `/api/bills`                    | Create a new bill                    |
| GET    | `/api/bills/:billId`            | Retrieve bill details & participants |
| POST   | `/api/payments/stkpush`         | Trigger M-Pesa STK Push for a share  |
| POST   | `/api/payments/callback`        | Handle Daraja payment callback       |
| POST   | `/api/payments/b2c`             | Disburse consolidated payment        |

### 6. Authentication & Security
- **Auth**: Supabase Auth (email/magic link, OAuth).
- **Secrets**: Store Daraja credentials and Supabase keys in environment variables.
- **Validation**: Validate request bodies and webhook signatures.
- **HTTPS & CORS**: Enforce HTTPS and restrict origins in CORS settings.

### 7. Deployment
- **Frontend**: Deploy web on Vercel/Netlify; mobile builds via Expo EAS.
- **Backend**: Host on Heroku or Render; use GitHub Actions for CI/CD.
- **Database**: Supabase free tier; monitor usage and scale as needed.

### 8. Usage Guide
1. Clone repo: `git clone https://github.com/ayuboketch/peer2peer-bill-splitter`
2. Install dependencies: `npm install` in both `/client` and `/server`.
3. Configure `.env` with Daraja & Supabase keys.
4. Run Supabase local: `supabase start` (if using local emulator).
5. Start server: `npm run dev` in `/server`.
6. Start client: `npm start` in `/client`; mobile: `expo start`.

### 9. Next Steps
- Add receipt scanning via OCR.
- Implement retries and partial payments.
- Integrate analytics dashboard (D3.js).
- Enhance UI/UX based on user feedback.


*End of Documentation*

