# React Frontend - Complete Feature & Flow Documentation

## Overview
This document provides complete per-page feature details and user flows for the NetPay Cards React frontend, based on the sidebar navigation structure of the existing Laravel application.

---

## Sidebar Navigation Structure

### User Portal Sidebar
1. **Dashboard**
2. **KYC**
3. **Wallet**
   - Wallet Overview
   - Deposit
   - Deposit History
   - Withdraw
   - Wallet History
   - Import Wallet
4. **Cards**
   - My Cards
   - Apply for Card
5. **Profile**
   - Profile Details
   - Change Password

### Admin Portal Sidebar
1. **Dashboard**
2. **Management**
   - Users
   - Transactions
   - Deposits
   - Withdrawals
   - Cardholders
   - Cards List
   - Physical Card Numbers
   - Merchants
3. **Crypto**
   - Dashboard
   - Hot Wallets
   - Gas Treasury
   - Crypto Deposits
   - Crypto Withdrawals
4. **Commission**
   - Settings
   - History
5. **System**
   - Server IP

### Merchant Portal Sidebar
1. **Dashboard**
2. **Physical Cards**
3. **Users**
4. **Cards**

---

## User Portal - Complete Feature Details
### 1. Dashboard (/dashboard)
**API Integration:** GET /api/dashboard

**Features:**
- Welcome banner with user name
- Account balance summary (USD locked + available + credit)
- KYC status badge (Not Submitted / Pending / Approved / Rejected)
- 2FA status badge (Enabled / Disabled)
- Recent transactions (last 5)
- Quick action buttons:
  - Verify KYC
  - Deposit Funds
  - Apply for Card
  - Transfer

**Data Displayed:**
- User: {first_name, last_name, email}
- Wallet: {balance, locked, credit}
- KYC: {kyc_status, kyc_rejection_reason}
- Recent transactions: [{type, amount, status, created_at}]

**User Actions:**
- Refresh balance
- Navigate to KYC page
- Navigate to deposit page
- Navigate to card application

---

### 2. KYC (/kyc)
**API Integration:** GET /api/kyc, POST /api/kyc (multipart)

**Features:**
- Document type selector: Passport / National ID / Driving License
- Form fields:
  - ID Number
  - Issue Date (date picker)
  - Expiry Date (date picker, must be > issue date)
- File upload areas:
  - Document Front (jpg/jpeg/png/pdf, max 1MB)
  - Document Back (jpg/jpeg/png/pdf, max 1MB)
  - Selfie with document (jpg/jpeg/png, max 1MB)
- Live validation with file preview
- Submit button (disabled until all validations pass)

**Status Display:**
- **Not Submitted:** Show application form
- **Pending:** "Under Review" badge, no edit allowed
- **In Review:** "In Review" badge, no edit allowed
- **Approved:** Green "Approved" badge, application locked
- **Rejected:** Red "Rejected" badge with reason, "Resubmit" button

**User Flow:**
1. User lands on KYC page
2. System checks existing kyc_status
3. If not_submitted/rejected → Show form
4. User fills information and uploads documents
5. Client-side validation (file type, size, expiry > issue)
6. Submit as multipart FormData
7. Show success message: "Documents submitted successfully! Review takes 1-2 business days."
8. Status changes to "Pending"

---

### 3. Wallet Overview (/wallet)
**API Integration:** GET /api/wallet

**Features:**
- Main balance card showing:
  - Total Balance (USD)
  - Available Balance
  - Locked Balance
  - Credit Line
- Quick actions:
  - Deposit
  - Withdraw
  - Import Wallet
- Recent transactions table (last 5 rows)
- Imported wallets list with delete action
- Auto-detected deposits section
- Pending withdrawals section

**Data Displayed:**
- Wallet: {balance, locked, credit}
- Recent transactions: [{id, type, amount, status, created_at}]
- Imported wallets: [{id, evm_address, tron_address, monitored}]
- Pending withdrawals: [{id, amount, chain, status}]

**User Actions:**
- Click Deposit → Navigate to /wallet/deposit
- Click Withdraw → Navigate to /wallet/withdraw
- Click Import → Navigate to /wallet/import
- Click transaction → Navigate to details
- Delete imported wallet

---

### 4. Deposit - Chain Selection (/wallet/deposit)
**API Integration:** GET /api/wallet/coins, POST /api/wallet/deposit

**Features:**
- 8 chain cards in grid layout:
  1. TRC20 (Tron) - Orange
  2. BEP20 (BSC) - Yellow
  3. ERC20 (Ethereum) - Purple
  4. POLYGON (Matic) - Blue
  5. ARBITRUM (Arbitrum) - Cyan
  6. BASE (Base) - Blue
  7. AVALANCHE (Avalanche) - Red
  8. OPTIMISM (Optimism) - Purple

**Each Card Shows:**
- Chain icon
- Chain name
- Native token (TRX, BNB, ETH, etc.)
- Minimum confirmations
- Deposit fee (if any)
- Status (Enabled/Disabled)

**User Flow:**
1. User sees 8 chain cards
2. Clicks on desired chain
3. System validates chain is enabled
4. POST to /api/wallet/deposit with {chain}
5. Server returns {address, qrSvg, autoDetect}
6. Navigate to /wallet/deposit/:chain

---

### 5. Deposit - QR Page (/wallet/deposit/:chain)
**API Integration:** POST /api/wallet/deposit/proof, POST /api/wallet/deposit/recheck/:id, GET /api/wallet/deposit-status?chain=

**Features:**
- **Header:** Chain name with icon
- **Address Section:**
  - Deposit address (QR code + text)
  - Copy address button
  - Warning: "Send only USDT to this address"
- **QR Code Section:**
  - Large QR code for scanning
  - Alternative: Manual address entry
- **Manual Proof Form:**
  - Transaction hash input
  - Submit button
  - Status display
- **Recent Deposits Table:**
  - Date
  - Amount
  - Status
  - Actions
- **Live Polling:** Auto-refresh every 6 seconds

**Status Badges:**
- **Unverified:** Gray - Waiting for transaction
- **Verified:** Blue - Awaiting confirmation
- **Completed:** Green - Funds credited
- **Rejected:** Red - Transaction failed

**User Actions:**
1. Scan QR code with wallet app
2. Send USDT to address
3. Wait for auto-detection (or submit tx hash manually)
4. System polls every 6s for status update
5. Balance updates when status = "Completed"

---

### 6. Withdraw (/wallet/withdraw)
**API Integration:** GET /api/wallet/withdraw, POST /api/wallet/withdraw

**Features:**
- Chain selector (same 8 chains)
- Amount input with slider
- Wallet address input
- Fee calculator (real-time)
- Commission preview
- Submit button (disabled if insufficient balance)
- Recent withdrawals table below

**Form Fields:**
- Chain: Dropdown
- Amount: Number input (min: 1, max: withdrawable)
- Wallet Address: Text input (validation by chain)
- Memo/Tag (if required)

**Validation:**
- Amount must be >= minimum withdrawal
- Amount must be <= available balance
- Address format validation (TRX: T..., ETH: 0x...)

**User Flow:**
1. Select chain
2. Enter amount (fee calculated in real-time)
3. Enter destination address
4. Review commission
5. Click "Withdraw"
6. Confirm dialog
7. Submit to server
8. Status: "Pending Approval"
9. Admin approves → "Processing" → "Completed"

---

### 7. Wallet History (/wallet/history)
**API Integration:** GET /api/wallet/history?type=&status=&tx_hash=&txn_id=&page=

**Features:**
- Filter bar with:
  - Type filter: Deposit/Withdrawal/Card/Other
  - Status filter: Pending/Completed/Failed/Rejected
  - Transaction hash search
  - Transaction ID search
  - Date range picker
- Paginated table (15 per page)
- Export to CSV button

**Table Columns:**
- Date
- Type (with icon)
- Amount
- Fee
- Status (with badge)
- Transaction Hash (link to explorer)
- Notes

**User Actions:**
- Apply filters
- Reset filters
- Change page
- Export data
- Click hash to view on block explorer

---

### 8. Import Wallet (/wallet/import)
**API Integration:** GET /api/wallet/imported, POST /api/wallet/import, DELETE /api/wallet/import/:id

**Features:**
- Textarea for mnemonic (12/15/18/21/24 words)
- Word count display
- Strength meter
- Import button
- Toggle: "Monitor for deposits"

**After Import:**
- Derived addresses shown:
  - EVM Address (0x...)
  - Tron Address (T...)
- Monitor toggle
- Delete button

**Validation:**
- Must be 12/15/18/21/24 words
- Valid wordlist check
- No duplicate imports

**User Flow:**
1. Paste mnemonic
2. Toggle monitor on/off
3. Click "Import"
4. System validates and encrypts
5. Shows derived addresses
6. Can toggle monitoring
7. Can delete

---

### 9. Cards Overview (/cards)
**API Integration:** GET /api/cards

**Features:**
- Grid of card visuals
- "Apply for New Card" button (disabled if KYC not approved)
- Filter by status: Active/Frozen/Cancelled/Pending
- Search by last 4 digits

**Each Card Shows:**
- Card type badge (Virtual/Physical)
- Masked PAN (**** **** **** 1234)
- Card brand icon
- Status badge (Active/Frozen/Cancelled/Pending/Processing/Failed)
- Balance
- "Manage" button

**User Actions:**
- Click card → Navigate to card details
- Click "Apply" → Navigate to application
- Filter by status
- Search

---

### 10. Apply for Card (/cards/apply)
**API Integration:** GET /api/cards/apply, POST /api/cards/apply, GET /api/cards/check-holder

**Features:**
- Two tabs: Virtual / Physical
- Physical tab disabled if not available
- Fee breakdown panel (sticky)

**Form Fields (Both):**
- Card Type selector (from Wasabi catalog)
- Holder Email (with duplicate check)
- Holder Mobile

**Physical Only:**
- Delivery Name
- Delivery Address
- Delivery City
- Delivery Country
- Delivery Postal Code
- Delivery Phone

**Validation:**
- Balance must be >= total cost
- Email format validation
- Duplicate holder check (debounced)
- Required fields

**Fee Breakdown:**
- Minimum Deposit
- Issuance Fee
- Percentage Fee
- **Total**

**User Flow:**
1. Select Virtual/Physical tab
2. Choose card type from catalog
3. Fill holder information
4. System checks for duplicates
5. Review fee breakdown
6. Click "Submit Application"
7. Status: "Processing"
8. Wait for Wasabi approval
9. Status becomes "Active"

---

### 11. Card Details (/cards/:id)
**API Integration:** GET /api/cards/:id, GET /api/cards/:id/reveal, GET /api/cards/:id/balance, POST /api/cards/:id/topup, POST /api/cards/:id/withdraw, POST /api/cards/:id/activate, POST /api/cards/:id/update-pin, POST /api/cards/:id/freeze, POST /api/cards/:id/unfreeze, POST /api/cards/:id/terminate

**Features:**
- Card visual (front/back with flip animation)
- Card information panel
- Balance display with refresh button
- Action buttons (context-sensitive)
- Transaction history tab

**Card Information:**
- Card type
- Status
- Expiry date
- Cardholder name
- Last transaction

**Reveal Section:**
- "Reveal Card Details" button
- Shows: Card Number, CVV, Expiry Date
- Auto-hides after 30 seconds
- Timer countdown

**Top-up Form:**
- Amount input (30-10,000)
- Fee preview (1.5%)
- Total calculation
- Submit button

**Withdraw (Unload) Form:**
- Amount input (1-10,000)
- Submit button

**Physical Card Only:**
- Activate section (PIN + Active Code)
- Update PIN section
- PIN strength validator

**Action Buttons Context:**
- Active: Top-up, Withdraw, Freeze, Terminate
- Frozen: Unfreeze, Terminate
- Pending: Wait (no actions)
- Processing: Wait (no actions)
- Cancelled: No actions

**User Actions:**
- Refresh balance
- Reveal card details
- Top-up card
- Withdraw funds
- Freeze card
- Unfreeze card
- Terminate card (with confirmation)
- Activate (physical)
- Update PIN (physical)
- View transactions

---

### 12. Card Transactions (/cards/:id/transactions)
**API Integration:** GET /api/cards/:id/transactions?tab=&page=&start=&end=

**Features:**
- Two tabs: Transactions / Authorizations
- Date range picker (start/end)
- Paginated table (20 per page)
- Export to CSV

**Table Columns (Transactions):**
- Date
- Type
- Amount
- Merchant
- Status
- Reference

**Table Columns (Authorizations):**
- Date
- Amount
- Merchant
- Status
- Authorization Code

**User Actions:**
- Switch tabs
- Select date range
- Change page
- Export data

---

### 13. Profile (/profile)
**API Integration:** GET /api/profile

**Features:**
- Read-only user information grid
- Account details section
- KYC status section
- 2FA status section
- Membership information

**Fields Displayed:**
- Name
- Email
- Gender
- Date of Birth
- Country
- Phone
- Address
- Postal Code
- KYC Status
- 2FA Status
- Member Since

**User Actions:**
- Navigate to change password
- Navigate to edit KYC
- Refresh data

---

### 14. Change Password (/profile/change-password)
**API Integration:** POST /api/profile/change-password

**Features:**
- Current password field (with show/hide toggle)
- New password field (with strength meter)
- Confirm password field
- Password requirements tooltip
- Submit button (disabled if requirements not met)

**Validation:**
- Current password must be correct
- New password >= 8 characters
- New password != current password
- New password matches confirmation
- Weak password check (no sequences, repeats)

**User Flow:**
1. Enter current password
2. Enter new password
3. Confirm new password
4. System validates
5. Click "Change Password"
6. Success message: "Password updated successfully"
7. Redirect to login

---

## Admin Portal - Complete Feature Details
### 1. Admin Dashboard (/admin)
**API Integration:** GET /api/admin/dashboard

**Features:**
- Statistics grid (4 cards)
  - User Statistics
  - Merchant Statistics
  - Card Statistics
  - Physical Card Pool
- Financial summary
  - Deposits (total/pending/today)
  - Withdrawals (total/pending/completed)
  - Commission earned
- Recent activity feed
  - New users
  - New transactions
  - New cards
  - New merchants
- Charts/visualizations
  - User growth
  - Transaction volume

**User Actions:**
- View detailed reports
- Navigate to management sections
- Refresh data

---

### 2. Users Management (/admin/users)
**API Integration:** GET /api/admin/users, POST /api/admin/users/:id/block, etc.

**Features:**
- Search bar (email/name)
- Filter sidebar:
  - KYC Status
  - Blocked status
  - Merchant
- User table with columns:
  - Name
  - Email
  - KYC Status
  - Blocked
  - Merchant
  - Balance
  - Actions
- Per-row actions dropdown:
  - Block/Unblock
  - Update KYC
  - Add Wallet Credit
  - Set Holder ID
  - Login As
  - Edit Commission
  - View Wallet

**Modals:**
- Update KYC: Status dropdown + rejection reason
- Add Wallet: Amount input
- Set Holder ID: Holder ID input
- Edit Commission: Rate inputs

**User Actions:**
- Search users
- Apply filters
- Perform per-row actions
- Bulk actions (if implemented)

---

### 3. Transactions (/admin/transactions)
**API Integration:** GET /api/admin/transactions

**Features:**
- Filter bar:
  - Type
  - Status
  - Search (txn_id, tx_hash, wsb_order_no, user email/name, notes)
- Paginated table (25/page)
- Export to CSV

**Table Columns:**
- Date
- Type
- User
- Amount
- Fee
- Status
- Reference
- Notes

**User Actions:**
- Apply filters
- Reset filters
- Export data
- View details

---

### 4. Deposits (/admin/deposits)
**API Integration:** GET /api/admin/deposits, POST /api/admin/deposits/:id/approve/reject

**Features:**
- Dual paginator layout:
  - Legacy Wallet Transactions
  - Auto-detected Deposits
- Per-row actions: Approve (with editable amount), Reject
- Status badges
- Confirmations display

**User Actions:**
- Approve deposit (adjust amount)
- Reject deposit
- Filter by status
- Export data

---

### 5. Withdrawals (/admin/withdrawals)
**API Integration:** GET /api/admin/withdrawals, POST /api/admin/withdrawals/:id/approve/reject

**Features:**
- Dual paginator layout
- Per-row actions: Approve, Reject
- Status badges
- Details view on expand

**User Actions:**
- Approve withdrawal
- Reject withdrawal (with refund)
- Filter by status
- Export data

---

### 6. Cardholders (/admin/cardholders)
**API Integration:** GET /api/admin/cardholders

**Features:**
- Aggregated by Wasabi holder_id
- Holder details
- Associated users
- Cards count
- "Wasabi Update" action

**User Actions:**
- Re-push user data to Wasabi
- View details
- Export data

---

### 7. Cards List (/admin/cards-list)
**API Integration:** GET /api/admin/cards-list

**Features:**
- Master list of all cards
- Sync status with Wasabi
- Per-row actions:
  - Fetch from Wasabi
  - Map to local record
- Filters
- Search

**User Actions:**
- Sync with Wasabi
- Map unmapped cards
- Export data

---

### 8. Physical Card Numbers (/admin/physical-card-numbers)
**API Integration:** CRUD operations

**Features:**
- Bulk upload (CSV/input)
- Card number management
- Assign to merchant
- Pre-assign to user
- Mark used/available
- Delete

**User Actions:**
- Upload bulk numbers
- Assign/unassign
- Mark status
- Export data

---

### 9. Merchants (/admin/merchants)
**API Integration:** Full CRUD

**Features:**
- List with active/inactive toggle
- Create form:
  - Name, tag, email, password
  - Type: Whitelabel/Partner
  - Branding: Logo upload, colors, card image
  - Settings: Title tag, powered by toggle
  - Limits: Virtual/Physical min deposit
- Edit with all fields
- Activate/deactivate
- Login as
- Commission edit

**User Actions:**
- Create merchant
- Edit merchant
- Toggle active
- Login as merchant
- Set commission

---

### 10. Commission Settings (/admin/commission-settings)
**API Integration:** GET/POST

**Features:**
- Rate inputs per type:
  - Deposit
  - Withdrawal
  - Card issuance (virtual/physical)
  - Card top-up
  - Etc.
- Type: Percentage / Fixed
- Hierarchy display

**User Actions:**
- Edit rates
- Save changes

---

### 11. Commission History (/admin/commission-history)
**API Integration:** GET

**Features:**
- Paginated ledger
- Filter by type
- Export to CSV

**Columns:**
- Date
- User/Merchant
- Type
- Amount
- Rate
- Commission
- Currency

---

### 12. Hot Wallet (/admin/hot-wallet)
**API Integration:** Wallet operations

**Features:**
- Embedded in Crypto Dashboard
- HD wallet management
- Transfer-out operations
- Balance display

---

### 13. Server IP (/admin/server-ip)
**API Integration:** GET/POST with password

**Features:**
- Password re-confirmation
- Public IP display
- Copy button
- Whitelist instructions

---

### 14. Crypto Dashboard (/admin/crypto)
**API Integration:** Various crypto endpoints

**Tabs:**
- **Overview:** Per-chain summary cards
- **Wallets:** HD hot wallets, admin wallets
- **Operations:** Service health, sweep controls
- **Deposits:** Crypto-only deposits
- **Withdrawals:** Crypto-only withdrawals

**Features:**
- Gas treasury management
- Scan all chains
- Auto-topup
- Service logs

---

## Merchant Portal - Complete Feature Details
### 1. Merchant Dashboard (/merchant)
**API Integration:** GET /api/merchant/dashboard

**Features:**
- Stats tiles:
  - Total Users
  - Total Cards
  - Physical Cards
- Quick links
- Branded theme

**User Actions:**
- Navigate to management pages
- View reports

---

### 2. Physical Cards (/merchant/physical-cards)
**API Integration:** GET/POST /api/merchant/physical-cards

**Features:**
- List assigned cards
- Filters: Available/Preassigned/Used
- Assign to user (dropdown)
- Unassign
- Search

**User Actions:**
- Assign card
- Unassign card
- View details

---

### 3. Users (/merchant/users)
**API Integration:** GET /api/merchant/users

**Features:**
- Read-only list
- Filter by status
- Export data

**Columns:**
- Name
- Email
- KYC
- Cards
- Balance

---

### 4. Cards (/merchant/cards)
**API Integration:** GET /api/merchant/cards

**Features:**
- Read-only list
- User's cards only
- Status display

**Columns:**
- Card Type
- Status
- Balance
- User

---

## User Flows - Step by Step

### Flow 1: New User Onboarding

```
1. Register (/register) → POST /api/register
   ↓
2. KYC Upload (/kyc) → POST /api/kyc (multipart)
   ↓
3. Wait for Admin Approval
   ↓
4. Dashboard (/dashboard) - View status
   ↓
5. Deposit (/wallet/deposit) → Generate address
   ↓
6. Send funds → Auto-detected / Manual proof
   ↓
7. Apply Card (/cards/apply) → POST /api/cards/apply
   ↓
8. Card Active → Top-up/Withdraw
```

### Flow 2: Crypto Deposit

```
1. Wallet → Deposit
   ↓
2. Select Chain (8 options)
   ↓
3. POST /api/wallet/deposit
   ↓
4. Get Address + QR Code
   ↓
5. Send USDT from external wallet
   ↓
6. wallet-service monitors (deposit-monitor.mjs)
   ↓
7. After confirmations → INSERT deposits row
   ↓
8. React polls GET /api/wallet/deposit-status (6s)
   ↓
9. Status: Completed → Balance updated
   ↓
Alternative: Manual proof → Submit tx hash → Admin approval
```

### Flow 3: Crypto Withdrawal

```
1. Wallet → Withdraw
   ↓
2. Select Chain
   ↓
3. Enter Amount (min/max validation)
   ↓
4. Enter Destination Address
   ↓
5. Preview Commission (GET /api/wallet/withdraw-quote)
   ↓
6. POST /api/wallet/withdraw
   ↓
7. Status: Pending → INSERT wallet_transactions (locked)
   ↓
8. Admin Approves (/admin/withdrawals)
   ↓
9. wallet-service picks up (withdrawal-processor.mjs)
   ↓
10. Sign + Broadcast
    ↓
11. Processing → Completed/Failed
    ↓
12. On Success: locked -= amount, balance updated
```

### Flow 4: Virtual Card Application

```
1. Cards → Apply (Virtual tab)
   ↓
2. Select Card Type from Wasabi
   ↓
3. Enter Holder Email/Mobile
   ↓
4. Debounced duplicate check (GET /api/cards/check-holder)
   ↓
5. Review Fee Breakdown
   ↓
6. POST /api/cards/apply
   ↓
7. Validate balance >= total
   ↓
8. Wasabi: createHolder() → issueCard()
   ↓
9. INSERT cards (status='processing')
   ↓
10. wallets.balance -= total
    ↓
11. Wasabi callback / list-... (line truncated to 2000 chars)