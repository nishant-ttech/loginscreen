# NetPay Cards - React Frontend Implementation Guide

## Overview
Complete implementation guide for cloning the NetPay Cards frontend in React. Covers all features, pages, API integrations, and user flows.

## Project Structure
```
frontend/
├── src/
│   ├── main.tsx                 # App entry
│   ├── App.tsx                  # Root component
│   ├── router.tsx               # React Router v6
│   ├── api/
│   │   ├── client.ts            # Axios instance
│   │   ├── auth.ts              # Auth endpoints
│   │   ├── wallet.ts            # Wallet endpoints
│   │   ├── cards.ts             # Card endpoints
│   │   ├── kyc.ts               # KYC endpoints
│   │   ├── profile.ts           # Profile endpoints
│   │   ├── admin.ts             # Admin endpoints
│   │   └── merchant.ts          # Merchant endpoints
│   ├── store/
│   │   ├── auth.ts              # Auth Zustand store
│   │   ├── theme.ts             # Theme Zustand store
│   │   └── merchantBranding.ts  # Merchant branding store
│   ├── hooks/
│   │   ├── useAuth.ts           # Auth hook
│   │   ├── useDepositPolling.ts # Deposit status polling
│   │   ├── useWithdrawalPolling.ts # Withdrawal polling
│   │   ├── useCardBalance.ts    # Card balance polling
│   │   └── useCheckHolder.ts    # Debounced holder check
│   ├── layouts/
│   │   ├── AppLayout.tsx        # User portal layout
│   │   ├── AdminLayout.tsx      # Admin layout
│   │   ├── MerchantLayout.tsx   # Merchant layout
│   │   └── GuestLayout.tsx      # Auth pages layout
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx       # Primary/Secondary/Danger/Ghost
│   │   │   ├── TextInput.tsx    # RHF compatible
│   │   │   ├── PasswordInput.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── CopyButton.tsx
│   │   │   └── ToastProvider.tsx
│   │   ├── QrCode.tsx           # QR code display
│   │   ├── PhoneInput.tsx       # Phone with area code
│   │   ├── ChainPicker.tsx      # 8-chain selector
│   │   ├── CardVisual.tsx       # Card front/back display
│   │   ├── FeesBreakdown.tsx    # Fee calculation display
│   │   └── ImpersonationBanner.tsx # Admin impersonation
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── TwoFactor.tsx
│   │   │   ├── Setup2FA.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── ForgotPasswordVerify.tsx
│   │   │   └── ForgotPasswordReset.tsx
│   │   ├── Dashboard.tsx
│   │   ├── kyc/
│   │   │   └── Index.tsx
│   │   ├── wallet/
│   │   │   ├── Index.tsx
│   │   │   ├── Deposit.tsx
│   │   │   ├── DepositQr.tsx
│   │   │   ├── Withdraw.tsx
│   │   │   ├── History.tsx
│   │   │   ├── Deposits.tsx
│   │   │   └── Import.tsx
│   │   ├── cards/
│   │   │   ├── Index.tsx
│   │   │   ├── Apply.tsx
│   │   │   ├── Show.tsx
│   │   │   └── Transactions.tsx
│   │   ├── profile/
│   │   │   ├── Index.tsx
│   │   │   └── ChangePassword.tsx
│   │   ├── admin/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Users.tsx
│   │   │   ├── Transactions.tsx
│   │   │   ├── Deposits.tsx
│   │   │   ├── Withdrawals.tsx
│   │   │   ├── Cardholders.tsx
│   │   │   ├── CardsList.tsx
│   │   │   ├── PhysicalCardNumbers.tsx
│   │   │   ├── CommissionSettings.tsx
│   │   │   ├── CommissionHistory.tsx
│   │   │   ├── HotWallet.tsx
│   │   │   ├── ServerIp.tsx
│   │   │   ├── UserWallet.tsx
│   │   │   ├── WalletService.tsx
│   │   │   ├── WalletServiceLogs.tsx
│   │   │   ├── merchants/
│   │   │   │   ├── Index.tsx
│   │   │   │   ├── Create.tsx
│   │   │   │   └── Edit.tsx
│   │   │   └── crypto/
│   │   │       ├── Dashboard.tsx
│   │   │       ├── HotWallets.tsx
│   │   │       ├── GasTreasury.tsx
│   │   │       ├── Deposits.tsx
│   │   │       └── Withdrawals.tsx
│   │   └── merchant/
│   │       ├── Login.tsx
│   │       ├── Dashboard.tsx
│   │       ├── PhysicalCards.tsx
│   │       ├── Users.tsx
│   │       └── Cards.tsx
│   ├── types/
│   │   ├── User.ts
│   │   ├── Card.ts
│   │   ├── Wallet.ts
│   │   └── Merchant.ts
│   └── utils/
│       ├── format.ts
│       ├── chains.ts
│       └── validators.ts
└── styles/
    ├── theme.css
    ├── global.css
    └── components.css
```

---

## Feature 1: Public Authentication

### Flow: Login / Register / 2FA / Forgot Password

#### 1.1 Login Page (`/login`)
**API Integration:**
- `POST /api/login` - User authentication
- `GET /api/me` - Get current user (after login)

**Request Body:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}
```

**Response:**
```typescript
// Success with 2FA setup needed
{ ok: true, redirect: '/2fa/setup', force_setup: true }

// Success with 2FA already enabled
{ ok: true, redirect: '/two-factor' }

// Error
{ ok: false, errors: { email: ['Invalid credentials'] } }
```

**Components:**
- `Login.tsx` - Tabs for Sign-in/Sign-up
- `TwoFactor.tsx` - 6-digit OTP input
- `Setup2FA.tsx` - QR code display

#### 1.2 Register Page (`/register/:merchant`)
**API Integration:**
- `GET /api/register/:merchant` - Get merchant branding
- `POST /api/register` - Create user account
- `GET /api/cities?country=XX` - Dynamic city dropdown

**Request Body:**
```typescript
interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  gender: 'M' | 'F';
  birthday: string; // >= 18 years
  country: string; // ISO-2
  area_code: string;
  mobile: string;
  town: string;
  address: string;
  post_code: string;
  password: string; // min 8 chars
  password_confirmation: string;
  terms: boolean;
  merchant_encoded?: string;
  referral_code?: string;
}
```

**Components:**
- `Register.tsx` - Branded registration form
- `CountrySelect` - ISO-2 country picker
- `CitySelect` - Dynamic based on country

#### 1.3 2FA Setup (`/2fa/setup`)
**API Integration:**
- `GET /api/2fa/setup` - Generate secret & QR code
- `POST /api/2fa/enable` - Verify & enable 2FA

**Response:**
```typescript
{
  qrCodeSvg: string; // base64 encoded
  secret: string; // base32
  qrCodeUrl: string; // otpauth://
}
```

**Component:**
```tsx
// Use qrcode.react for client-side rendering
import { QRCodeSVG } from 'qrcode.react';

<QRCodeSVG 
  value={otpauthUrl} 
  size={280} 
  bgColor="transparent" 
  fgColor="var(--text)" 
/>
```

#### 1.4 Forgot Password (3 Steps)
**API Integration:**
- `POST /api/forgot-password` - Submit email
- `POST /api/forgot-password/verify` - Verify TOTP
- `POST /api/forgot-password/reset` - Set new password

**Session Keys (server-side):**
- `fp:user_id`
- `fp:email`
- `fp:verified`

---

## Feature 2: KYC Submission

### Page: `/kyc`
**API Integration:**
- `GET /api/kyc` - Get current status
- `POST /api/kyc` - Submit documents (multipart)

**Request (FormData):**
```typescript
interface KYCRequest {
  doc_type: 'passport' | 'national_id' | 'driving_license';
  id_number: string;
  issue_date: string;
  expiry_date: string; // > issue_date
  doc_front: File; // jpg/jpeg/png/pdf, max 1MB
  doc_back: File; // jpg/jpeg/png/pdf, max 1MB
  selfie: File; // jpg/jpeg/png, max 1MB
}
```

**Status Values:**
- `not_submitted`
- `pending`
- `in_review`
- `approved`
- `rejected`

**Components:**
- `FileDrop` - Drag & drop file upload with preview
- `KycStatus` - Banner showing current status

---

## Feature 3: Wallet (8 Chains)

### 3.1 Wallet Overview (`/wallet`)
**API Integration:**
- `GET /api/wallet` - Wallet overview

**Response:**
```typescript
{
  wallet: {
    balance: number;
    locked: number;
    currency: 'USDT';
  };
  recent: Transaction[];
  importedWallets: ImportedWallet[];
  autoDeposits: Deposit[];
  pendingWithdrawals: Withdrawal[];
}
```

### 3.2 Deposit (`/wallet/deposit`)
**API Integration:**
- `GET /api/wallet/coins` - Supported chains & metadata
- `POST /api/wallet/deposit` - Generate deposit address

**Request:**
```typescript
{ chain: ChainKey }
```

**Response:**
```typescript
{
  chain: ChainKey;
  address: string;
  qrSvg: string; // base64
  autoDetect: boolean;
  requiredConfirmations: number;
}
```

**Supported Chains:**
- TRC20 (Tron)
- BEP20 (BSC)
- ERC20 (Ethereum)
- POLYGON
- ARBITRUM
- BASE
- AVALANCHE
- OPTIMISM

### 3.3 Deposit QR Page (`/wallet/deposit/:chain`)
**API Integration:**
- `POST /api/wallet/deposit/proof` - Submit transaction hash
- `POST /api/wallet/deposit/recheck/:id` - Recheck deposit
- `GET /api/wallet/deposit-status?chain=XX` - Live polling

**Polling Hook:**
```typescript
useQuery({
  queryKey: ['deposit-status', chain],
  queryFn: () => api.get(`/api/wallet/deposit-status?chain=${chain}`),
  refetchInterval: 6000, // 6 seconds
  enabled: !!chain
});
```

### 3.4 Withdraw (`/wallet/withdraw`)
**API Integration:**
- `GET /api/wallet/withdraw` - Get limits & quote
- `POST /api/wallet/withdraw` - Create withdrawal
- `GET /api/wallet/withdrawal-status` - Live polling

**Request:**
```typescript
{
  chain: ChainKey;
  amount: number; // 1 <= amount <= withdrawable
  wallet_address: string;
}
```

**Commission:** Calculated via `CommissionService` on backend

### 3.5 History (`/wallet/history`)
**API Integration:**
- `GET /api/wallet/history` - Paginated transactions

**Query Params:**
```typescript
{
  type?: string;
  status?: string;
  tx_hash?: string;
  txn_id?: string;
  page?: number;
}
```

### 3.6 Import Wallet (`/wallet/import`)
**API Integration:**
- `GET /api/wallet/imported` - Get imported wallets
- `POST /api/wallet/import` - Import mnemonic
- `DELETE /api/wallet/import/:id` - Remove imported wallet

**Request:**
```typescript
{ mnemonic: string } // 12/15/18/21/24 words
```

---

## Feature 4: Cards

### 4.1 Cards Index (`/cards`)
**API Integration:**
- `GET /api/cards` - List all cards
- Background sync with Wasabi

**Card Status Values:**
- `pending` → `processing` → `active`
- `frozen` ↔ `active`
- `terminated` (cancelled)
- `failed`

### 4.2 Apply Card (`/cards/apply`)
**API Integration:**
- `GET /api/cards/apply` - Fees, card types, balance
- `POST /api/cards/apply` - Submit application
- `GET /api/cards/check-holder?field=&value=` - Debounced duplicate check

**Request (Virtual):**
```typescript
{
  card_type: 'virtual';
  card_type_id: string;
  holder_email: string;
  holder_mobile: string;
}
```

**Request (Physical):**
```typescript
{
  card_type: 'physical';
  card_type_id: string;
  holder_email: string;
  holder_mobile: string;
  delivery_name: string;
  delivery_address: string;
  delivery_city: string;
  delivery_country: string;
  delivery_postal_code: string;
  delivery_phone: string;
}
```

### 4.3 Card Details (`/cards/:id`)
**API Integration:**
- `GET /api/cards/:id` - Card details (encrypted ID)
- `GET /api/cards/:id/reveal` - Reveal PAN/CVV (one-shot)
- `GET /api/cards/:id/balance` - Refresh balance
- `POST /api/cards/:id/topup` - Load funds
- `POST /api/cards/:id/withdraw` - Unload funds
- `POST /api/cards/:id/freeze` / `unfreeze` / `terminate`

**Security:**
- Encrypted IDs via Laravel `Crypt::encrypt($id)`
- Reveal auto-hides after 30s
- Weak PIN validation (no sequences, repeats)

**PIN Validation:**
```typescript
function isPinWeak(pin: string): boolean {
  if (/(\d)\1{2}/.test(pin)) return true; // "111"
  const d = pin.split('').map(Number);
  let asc = true, desc = true;
  for (let i = 1; i < d.length; i++) {
    if (d[i] !== d[i-1] + 1) asc = false;
    if (d[i] !== d[i-1] - 1) desc = false;
  }
  if (asc || desc) return true; // "123", "321"
  if (/^(\d{2})\1{2}$/.test(pin)) return true; // "121212"
  if (/^(\d{3})\1$/.test(pin)) return true; // "123123"
  return false;
}
```

### 4.4 Card Transactions (`/cards/:id/transactions`)
**API Integration:**
- `GET /api/cards/:id/transactions` - Transaction history

**Tabs:** Transactions | Authorizations

---

## Feature 5: Profile

### Pages: `/profile`, `/profile/change-password`
**API Integration:**
- `GET /api/profile` - User profile data
- `POST /api/profile/change-password` - Update password

**Change Password Request:**
```typescript
{
  current_password: string;
  password: string;
  password_confirmation: string;
}
```

---

## Feature 6: Admin Panel

**Layout:** Sidebar with sections:
- MANAGEMENT (Users, Deposits, Withdrawals, Transactions, Cardholders, Cards, Physical Cards, Merchants)
- CRYPTO (Dashboard, Wallets, Gas Treasury, Deposits, Withdrawals)
- COMMISSION (Settings, History)
- SYSTEM (Server IP)

### 6.1 Dashboard (`/admin`)
**API:** `GET /api/admin/dashboard`

**Stats:**
- User stats (total/blocked/today, KYC counts)
- Merchant stats
- Card stats
- Physical card pool
- Deposits/Withdrawals totals
- Commission earned
- Recent activity

### 6.2 Users (`/admin/users`)
**Actions:**
- Block/Unblock: `POST /api/admin/users/:id/block` / `unblock`
- Update KYC: `POST /api/admin/users/:id/kyc`
- Add wallet credit: `POST /api/admin/users/:id/add-wallet`
- Set holder ID: `POST /api/admin/users/:id/holder-id`
- Login as: `POST /api/admin/users/:id/login-as`

### 6.3 Deposits (`/admin/deposits`)
**Dual Table:** Legacy wallet_transactions + auto-detected deposits

**Actions:**
- Approve: `POST /api/admin/deposits/:id/approve`
- Reject: `POST /api/admin/deposits/:id/reject`

### 6.4 Withdrawals (`/admin/withdrawals`)
**Actions:**
- Approve: `POST /api/admin/withdrawals/:id/approve`
- Reject: `POST /api/admin/withdrawals/:id/reject`

### 6.5 Crypto Dashboard (`/admin/crypto`)
**Tabs:** Overview / Wallets / Operations / Deposits / Withdrawals

**Gas Treasury:**
- Per-wallet/per-chain table
- Scan All Chains button
- Gas logs

### 6.6 Physical Card Numbers (`/admin/physical-card-numbers`)
**Actions:**
- Bulk upload
- Assign to merchant
- Pre-assign to user
- Mark used/available

---

## Feature 7: Merchant Portal

### Pages: `/merchant/*`
**Branded Login:** `/merchant-login/:tag` resolves merchant branding

**Dynamic Branding:**
```typescript
function applyMerchantBranding(merchant: Merchant) {
  const root = document.documentElement;
  root.style.setProperty('--green', merchant.primary_color || '#00c853');
  root.style.setProperty('--green-bright', merchant.secondary_color || '#39ff14');
}
```

**API Endpoints:**
- `GET /api/merchant-login/:tag` - Get branding
- `POST /api/merchant/login` - Login
- `GET /api/merchant/dashboard` - Dashboard
- `GET /api/merchant/physical-cards` - Physical cards list
- `POST /api/merchant/physical-cards/:card/assign` - Assign card
- `POST /api/merchant/return-to-admin` - Return from impersonation

**Pages:**
- Merchant Dashboard
- Physical Cards (assign/unassign)
- Users (read-only)
- Cards (read-only)

---

## API Contract Summary

### Public Endpoints
```
POST   /api/login
POST   /api/register
GET    /api/register/:tag
POST   /api/logout
GET    /api/me
POST   /api/two-factor
POST   /api/2fa/setup
POST   /api/2fa/enable
POST   /api/forgot-password
POST   /api/forgot-password/verify
POST   /api/forgot-password/reset
GET    /api/cities?country=XX
```

### User Endpoints
```
GET    /api/dashboard
GET    /api/kyc
POST   /api/kyc
GET    /api/wallet
GET    /api/wallet/coins
POST   /api/wallet/deposit
GET    /api/wallet/deposit-status
POST   /api/wallet/deposit/proof
POST   /api/wallet/deposit/recheck/:id
GET    /api/wallet/deposits
GET    /api/wallet/withdraw
POST   /api/wallet/withdraw
GET    /api/wallet/withdrawal-status
GET    /api/wallet/history
GET    /api/wallet/imported
POST   /api/wallet/import
DELETE /api/wallet/import/:id
GET    /api/cards
GET    /api/cards/apply
POST   /api/cards/apply
GET    /api/cards/check-holder
GET    /api/cards/:id
GET    /api/cards/:id/transactions
POST   /api/cards/:id/topup
POST   /api/cards/:id/withdraw
POST   /api/cards/:id/activate
POST   /api/cards/:id/update-pin
POST   /api/cards/:id/freeze
POST   /api/cards/:id/unfreeze
POST   /api/cards/:id/terminate
GET    /api/cards/:id/balance
GET    /api/cards/:id/reveal
POST   /api/profile/change-password
```

### Admin Endpoints (30+)
```
POST   /api/admin/login
POST   /api/admin/logout
GET    /api/admin/me
GET    /api/admin/dashboard
GET    /api/admin/users
POST   /api/admin/users/:id/block
POST   /api/admin/users/:id/unblock
POST   /api/admin/users/:id/kyc
POST   /api/admin/users/:id/add-wallet
POST   /api/admin/users/:id/holder-id
POST   /api/admin/users/:id/login-as
GET    /api/admin/transactions
GET    /api/admin/deposits
POST   /api/admin/deposits/:id/approve
POST   /api/admin/deposits/:id/reject
GET    /api/admin/withdrawals
POST   /api/admin/withdrawals/:id/approve
POST   /api/admin/withdrawals/:id/reject
GET    /api/admin/cardholders
POST   /api/admin/cardholders/:id/wasabi-update
GET    /api/admin/cards-list
GET    /api/admin/cards-list/fetch-wasabi
POST   /api/admin/cards-list/map-card
GET    /api/admin/physical-card-numbers
POST   /api/admin/physical-card-numbers
DELETE /api/admin/physical-card-numbers/:id
POST   /api/admin/physical-card-numbers/:id/assign-merchant
POST   /api/admin/physical-card-numbers/:id/pre-assign-user
POST   /api/admin/physical-card-numbers/:id/mark-used
POST   /api/admin/physical-card-numbers/:id/mark-available
GET    /api/admin/server-ip
POST   /api/admin/server-ip
GET    /api/admin/commission-settings
POST   /api/admin/commission-settings
GET    /api/admin/commission-history
GET    /api/admin/hot-wallet/create
POST   /api/admin/hot-wallet/create
POST   /api/admin/hot-wallet/:id/toggle
POST   /api/admin/hot-wallet/:id/transfer
POST   /api/admin/sweep/user/:userId
POST   /api/admin/sweep/all
GET    /api/admin/wallet-service
GET    /api/admin/wallet-service-logs
```

### Merchant Endpoints
```
GET    /api/merchant-login/:tag
POST   /api/merchant/login
POST   /api/merchant/logout
GET    /api/merchant/me
GET    /api/merchant/dashboard
GET    /api/merchant/physical-cards
POST   /api/merchant/physical-cards/:card/assign
POST   /api/merchant/physical-cards/:card/unassign
GET    /api/merchant/users
GET    /api/merchant/cards
POST   /api/merchant/return-to-admin
```

---

## Authentication Flow

### Sanctum Setup
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### Axios Client Setup
```typescript
// src/api/client.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '',
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

// CSRF cookie
export const getCsrfCookie = () => api.get('/sanctum/csrf-cookie');
```

### Auth Guard
```typescript
// src/hooks/useAuth.ts
export function useAuth() {
  // Zustand store with user state
  // fetchMe() -> GET /api/me
  // logout() -> POST /api/logout
}

// AuthGate component
function AuthGate({ children }) {
  const { user, isLoading, fetchMe } = useAuthStore();
  useEffect(() => { fetchMe(); }, []);
  if (isLoading) return <Spinner />;
  if (!user) return <Navigate to="/login" />;
  if (!user.two_factor_enabled) return <Navigate to="/2fa/setup" />;
  return children;
}
```

---

## State Machines

### Card Status Flow
```
pending → processing → active ↔ frozen
                      ↓
                  cancelled (terminal)
                      ↓
                  failed (terminal)

Physical-only: un_activated → [activate w/ PIN] → active
```

### Deposit Status Flow
```
unverified → verified → completed (terminal)
                        ↓
                    rejected (terminal)
detected (auto) → completed
```

### Withdrawal Status Flow
```
pending → approved → processing → completed (terminal)
    ↓                           ↓
rejected                      failed
    ↓                           ↓
(refund)                   (refund)
```

--- ## Implementation Priority

### Phase 1: Auth (Days 1-3)
- [ ] Axios + Sanctum setup
- [ ] Login/Register pages
- [ ] 2FA setup & verify
- [ ] Forgot password (3 steps)
- [ ] AuthGuard & layouts

### Phase 2: KYC + Profile (Days 4-5)
- [ ] KYC upload form
- [ ] Profile view
- [ ] Change password

### Phase 3: Wallet (Days 6-10)
- [ ] Wallet overview
- [ ] Deposit flow (auto + manual)
- [ ] Withdraw flow
- [ ] History with filters
- [ ] Import wallet

### Phase 4: Cards (Days 11-15)
- [ ] Cards index + sync
- [ ] Apply (virtual + physical)
- [ ] Card details + reveal
- [ ] Top-up + withdraw
- [ ] Freeze/Unfreeze/Terminate
- [ ] Activate + Update PIN (physical)
- [ ] Transactions tab

### Phase 5: Admin (Days 16-25)
- [ ] Admin auth + layout
- [ ] Users management
- [ ] Deposits/Withdrawals approval
- [ ] Cardholders + Cards list
- [ ] Physical card numbers CRUD
- [ ] Merchants CRUD
- [ ] Commission settings
- [ ] Crypto dashboard

### Phase 6: Merchant (Days 26-28)
- [ ] Branded login
- [ ] Merchant dashboard
- [ ] Physical cards
- [ ] Users/Cards read-only

---

## Critical Security Notes

1. **Never expose in frontend:**
   - WASABI_PRIVATE_KEY (RSA signing)
   - APP_KEY (Laravel encryption)
   - Hot wallet private keys
   - Mnemonic encryption keys

2. **Encrypted IDs:**
   - All card IDs use `Crypt::encrypt($id)`
   - Backend decrypts, frontend passes encrypted value

3. **Card Reveal:**
   - One-shot endpoint, auto-hide after 30s
   - Server decrypts PAN/CVV on-demand

4. **PIN/Password:**
   - Weak PIN validation on backend
   - Hash::check for current password

5. **CSRF:**
   - Sanctum cookie handles automatically
   - `withCredentials: true` on axios

---

## Quick Start Commands

```bash
# Backend
php artisan serve              # http://127.0.0.1:8000

# Wallet service
cd wallet-service && node src/index.mjs

# Frontend
cd frontend && npm run dev     # http://localhost:5173
```

## Golden Path Test

1. Register user → Setup 2FA → Submit KYC
2. Admin approves KYC
3. Generate TRC20 deposit address → Send test credit
4. Apply for Virtual card → Wait for Wasabi sync
5. Top-up $30 → Reveal card → Freeze → Terminate
6. Withdraw $5 → Admin approves

---

**Reference:** Full details in `REACT-MIGRATION.md` (1881 lines)