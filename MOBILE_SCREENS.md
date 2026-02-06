# Mobile Screen Specifications

## Design Principles

- **Minimal & Clean**: No clutter, focus on content
- **Modern UI**: Rounded corners, shadows, smooth transitions
- **Android-First**: Optimized for Android (Material Design inspired)
- **Accessibility**: Proper labels, contrast ratios, touch targets
- **Consistent**: Reusable components, consistent spacing

---

## Color Palette

```typescript
primary: '#4F46E5',      // Indigo - Primary actions
secondary: '#10B981',    // Green - Success, balances
error: '#EF4444',        // Red - Errors, debts
warning: '#F59E0B',      // Amber - Warnings
background: '#FFFFFF',   // White - Screen background
surface: '#F9FAFB',      // Light gray - Cards
text: '#111827',         // Dark gray - Primary text
textSecondary: '#6B7280', // Medium gray - Secondary text
border: '#E5E7EB'        // Light gray - Borders
```

---

## Typography

```typescript
heading1: {
  fontSize: 28,
  fontWeight: '700',
  color: text
}
heading2: {
  fontSize: 24,
  fontWeight: '600',
  color: text
}
heading3: {
  fontSize: 20,
  fontWeight: '600',
  color: text
}
body: {
  fontSize: 16,
  fontWeight: '400',
  color: text
}
caption: {
  fontSize: 14,
  fontWeight: '400',
  color: textSecondary
}
```

---

## Spacing System

```typescript
xs: 4,
sm: 8,
md: 16,
lg: 24,
xl: 32,
xxl: 48
```

---

## Navigation Structure

```
AppNavigator (conditional)
├── AuthNavigator (if not logged in)
│   ├── LoginScreen
│   └── OtpScreen
└── MainNavigator (if logged in)
    ├── BottomTabNavigator
    │   ├── HomeTab → HomeStack
    │   │   ├── GroupsListScreen
    │   │   ├── GroupDetailsScreen
    │   │   ├── AddExpenseScreen
    │   │   ├── BalancesScreen
    │   │   └── SettleUpScreen
    │   ├── ActivityTab
    │   │   └── ActivityScreen
    │   └── ProfileTab
    │       ├── ProfileScreen
    │       └── EditProfileScreen
    └── Modals
        ├── CreateGroupModal
        └── AddMemberModal
```

---

## Screen Details

### 1. LoginScreen

**Path**: `/login`

**Purpose**: Entry point, collect user email

**Layout**:
```
┌─────────────────────────────────┐
│                                 │
│         [App Logo]              │
│                                 │
│      Split It                   │
│   Share expenses easily         │
│                                 │
│   ┌─────────────────────────┐  │
│   │ Email                   │  │
│   │ [john@example.com     ] │  │
│   └─────────────────────────┘  │
│                                 │
│   ┌─────────────────────────┐  │
│   │   Send OTP              │  │
│   └─────────────────────────┘  │
│                                 │
│   By continuing, you agree to   │
│   our Terms & Privacy Policy    │
│                                 │
└─────────────────────────────────┘
```

**Components**:
- App logo (center, large)
- Tagline text
- Email input field
- "Send OTP" button (primary color)
- Terms text (small, gray)
- Loading spinner (when sending OTP)

**Validation**:
- Email format check
- Show inline error if invalid

**User Flow**:
1. User enters email
2. Taps "Send OTP"
3. Loading state shown
4. Navigate to OtpScreen
5. Show success toast: "OTP sent to your email"

**Error Cases**:
- Invalid email: Show inline error
- Rate limited: Show error toast
- Network error: Show error toast with retry button

---

### 2. OtpScreen

**Path**: `/otp`

**Purpose**: Verify OTP and complete login

**Layout**:
```
┌─────────────────────────────────┐
│  [← Back]                       │
│                                 │
│    Enter OTP                    │
│                                 │
│   We sent a 6-digit code to     │
│   john@example.com              │
│                                 │
│   ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐
│   │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 │
│   └───┘ └───┘ └───┘ └───┘ └───┘ └───┘
│                                 │
│   Didn't receive?  Resend OTP   │
│                                 │
│   ┌─────────────────────────┐  │
│   │   Verify & Continue     │  │
│   └─────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

**Components**:
- Back button (top left)
- Heading text
- Instructions text with email
- 6 OTP input boxes (auto-focus next)
- Resend OTP link (with countdown timer)
- "Verify & Continue" button
- Loading spinner (when verifying)

**User Flow**:
1. User enters 6-digit OTP
2. Auto-submit when 6 digits entered OR tap button
3. Loading state shown
4. Success: Navigate to HomeScreen
5. Error: Show error, clear OTP fields

**Error Cases**:
- Invalid OTP: Show error toast, clear fields
- Expired OTP: Show error toast with resend option
- Network error: Show error toast

**Additional Features**:
- Auto-focus next input box
- Paste support (detect 6-digit paste)
- Countdown timer: "Resend in 30s"

---

### 3. GroupsListScreen (Home)

**Path**: `/home`

**Purpose**: Display all groups user is part of

**Layout**:
```
┌─────────────────────────────────┐
│  Groups              [+ New]    │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🏖️ Bali Trip 2026        │   │
│  │ 4 members • $120 total   │   │
│  │ You owe: $30            ✓│   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🏠 Roommates             │   │
│  │ 3 members • $450 total   │   │
│  │ You're owed: $50        ✓│   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🍕 Weekend Trip          │   │
│  │ 5 members • $0 settled   │   │
│  │ All settled up          ✓│   │
│  └─────────────────────────┘   │
│                                 │
│  [Empty state if no groups]    │
│  "Create your first group"     │
│                                 │
└─────────────────────────────────┘
Bottom Tab: [Home] [Activity] [Profile]
```

**Components**:
- Header with title and "+ New" button
- List of GroupCard components
- Empty state (if no groups)
- Pull-to-refresh
- Bottom tab navigation

**GroupCard Component**:
- Group emoji/icon
- Group name
- Member count + total expenses
- User's balance (owed/owing)
- Chevron icon (tap to view details)
- Color indicator (red = owing, green = owed, gray = settled)

**User Flow**:
1. User lands on home after login
2. See list of groups
3. Tap "+ New" to create group
4. Tap any card to view details

**Loading State**:
- Skeleton cards while loading

**Empty State**:
- Large illustration
- "Create your first group" text
- "New Group" button

---

### 4. GroupDetailsScreen

**Path**: `/groups/:groupId`

**Purpose**: View group details, members, and expenses

**Layout**:
```
┌─────────────────────────────────┐
│  [← Back]  Bali Trip    [⋮]     │
│                                 │
│  ┌─────────────────────────┐   │
│  │ MEMBERS (4)             │   │
│  │ ○ John (You) • Admin    │   │
│  │ ○ Jane                  │   │
│  │ ○ Bob                   │   │
│  │ ○ Alice                 │   │
│  │ [+ Add Member]          │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ YOUR BALANCE            │   │
│  │ You owe: $30.00         │   │
│  │ [View Balances]         │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ [+ Add Expense]         │   │
│  └─────────────────────────┘   │
│                                 │
│  RECENT EXPENSES                │
│  ┌─────────────────────────┐   │
│  │ 🍝 Dinner               │   │
│  │ John paid $80 • Feb 1   │   │
│  │ Your share: $20         │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🏨 Hotel                │   │
│  │ Jane paid $200 • Jan 30 │   │
│  │ Your share: $50         │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

**Components**:
- Header with back button, group name, menu (⋮)
- Members section (collapsible)
- Balance summary card
- "Add Expense" button (prominent)
- Expense list (scrollable)

**Menu Options (⋮)**:
- Edit group
- Add member
- View all balances
- Group settings
- Leave group (destructive)

**User Flow**:
1. User taps group card from home
2. See group details
3. Add expense, view balances, or manage members

**Tabs (Alternative Layout)**:
- Expenses (default)
- Balances
- Members
- Settings

---

### 5. AddExpenseScreen

**Path**: `/groups/:groupId/add-expense`

**Purpose**: Add a new expense to the group

**Layout**:
```
┌─────────────────────────────────┐
│  [← Cancel]  Add Expense [Save] │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Description             │   │
│  │ [Dinner at Italian    ] │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Amount                  │   │
│  │ [$ 80.00              ] │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Paid by                 │   │
│  │ [John (You)           ▼]│   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Date                    │   │
│  │ [Feb 1, 2026          ▼]│   │
│  └─────────────────────────┘   │
│                                 │
│  SPLIT WITH                     │
│  ┌─────────────────────────┐   │
│  │ ☑ John (You)   $20.00   │   │
│  │ ☑ Jane         $20.00   │   │
│  │ ☑ Bob          $20.00   │   │
│  │ ☑ Alice        $20.00   │   │
│  └─────────────────────────┘   │
│                                 │
│  Split type: [Equal ▼]          │
│                                 │
└─────────────────────────────────┘
```

**Components**:
- Header with cancel/save buttons
- Description input
- Amount input (numeric keyboard)
- Paid by dropdown (group members)
- Date picker
- Split with section (checkboxes)
- Split type dropdown (Equal/Manual)
- Individual amount inputs (if manual split)

**Validation**:
- Description required (1-200 chars)
- Amount required (> 0)
- At least one person selected for split
- Split amounts must sum to total (if manual)

**User Flow**:
1. User taps "Add Expense" from group details
2. Fill in form
3. Tap "Save"
4. Loading state
5. Success: Navigate back to group details
6. Show success toast: "Expense added"

**Split Types**:
- **Equal**: Amount divided equally among selected members
- **Manual**: User enters individual amounts (must sum to total)

---

### 6. BalancesScreen

**Path**: `/groups/:groupId/balances`

**Purpose**: View all balances in the group

**Layout**:
```
┌─────────────────────────────────┐
│  [← Back]  Balances             │
│                                 │
│  GROUP SUMMARY                  │
│  Total expenses: $450.00        │
│  Settled: $100.00               │
│  Unsettled: $350.00             │
│                                 │
│  YOUR BALANCE                   │
│  ┌─────────────────────────┐   │
│  │ You owe: $30.00         │   │
│  │                         │   │
│  │ You owe Jane    $20.00  │   │
│  │ [Settle Up]             │   │
│  │                         │   │
│  │ You owe Bob     $10.00  │   │
│  │ [Settle Up]             │   │
│  └─────────────────────────┘   │
│                                 │
│  ALL BALANCES                   │
│  ┌─────────────────────────┐   │
│  │ Jane's balance: +$50.00 │   │
│  │ ↳ Bob owes $30          │   │
│  │ ↳ Alice owes $20        │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Bob's balance: -$40.00  │   │
│  │ ↳ Owes Jane $30         │   │
│  │ ↳ Owes You $10          │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

**Components**:
- Group summary card (total, settled, unsettled)
- User's balance section (prominent)
- "Settle Up" buttons next to each debt
- All balances section (expandable)

**Color Coding**:
- Green: User is owed
- Red: User owes
- Gray: Settled up

**User Flow**:
1. User taps "View Balances" from group details
2. See all balances
3. Tap "Settle Up" to record payment

---

### 7. SettleUpScreen

**Path**: `/groups/:groupId/settle/:userId`

**Purpose**: Record a settlement payment

**Layout**:
```
┌─────────────────────────────────┐
│  [← Cancel]  Settle Up   [Done] │
│                                 │
│  You are settling with:         │
│  Jane Smith                     │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Amount                  │   │
│  │ [$ 20.00              ] │   │
│  └─────────────────────────┘   │
│                                 │
│  You owe: $20.00                │
│  Enter amount you paid          │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Notes (optional)        │   │
│  │ [Paid via Venmo       ] │   │
│  └─────────────────────────┘   │
│                                 │
│  ⚠ Jane will need to confirm    │
│     this settlement             │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Record Payment          │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

**Components**:
- Header with cancel/done buttons
- Payee name and avatar
- Amount input (pre-filled with owed amount)
- Notes input (optional)
- Warning text about confirmation
- "Record Payment" button

**Validation**:
- Amount required (> 0)
- Amount cannot exceed owed amount

**User Flow**:
1. User taps "Settle Up" from balances screen
2. Fill in amount (defaults to full owed amount)
3. Add optional notes
4. Tap "Record Payment"
5. Success: Navigate back to balances
6. Show success toast: "Payment recorded"
7. Email sent to payee for confirmation

---

### 8. ActivityScreen

**Path**: `/activity`

**Purpose**: View recent expenses across all groups

**Layout**:
```
┌─────────────────────────────────┐
│  Activity                       │
│                                 │
│  TODAY                          │
│  ┌─────────────────────────┐   │
│  │ Bali Trip               │   │
│  │ 🍝 Dinner               │   │
│  │ John paid $80           │   │
│  │ Your share: $20         │   │
│  └─────────────────────────┘   │
│                                 │
│  YESTERDAY                      │
│  ┌─────────────────────────┐   │
│  │ Roommates               │   │
│  │ 🏨 Hotel                │   │
│  │ Jane paid $200          │   │
│  │ Your share: $50         │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Bali Trip               │   │
│  │ 💰 John settled $20     │   │
│  │ with you                │   │
│  └─────────────────────────┘   │
│                                 │
│  LAST WEEK                      │
│  ...                            │
│                                 │
└─────────────────────────────────┘
Bottom Tab: [Home] [Activity] [Profile]
```

**Components**:
- Grouped list by date (Today, Yesterday, Last Week, etc.)
- Expense cards (tap to view details)
- Settlement cards
- Pull-to-refresh
- Load more on scroll

**User Flow**:
1. User taps Activity tab
2. See chronological list of all activity
3. Tap any item to view details

---

### 9. ProfileScreen

**Path**: `/profile`

**Purpose**: View and edit user profile

**Layout**:
```
┌─────────────────────────────────┐
│  Profile                        │
│                                 │
│        [Avatar]                 │
│      John Doe                   │
│   john@example.com              │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ✏ Edit Profile          │   │
│  └─────────────────────────┘   │
│                                 │
│  ACCOUNT                        │
│  ┌─────────────────────────┐   │
│  │ 👤 Name                 │   │
│  │    John Doe            ›│   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ✉ Email                │   │
│  │    john@example.com    ›│   │
│  └─────────────────────────┘   │
│                                 │
│  ABOUT                          │
│  ┌─────────────────────────┐   │
│  │ ℹ About Split It       ›│   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 📜 Terms of Service    ›│   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🔒 Privacy Policy      ›│   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🚪 Log Out              │   │
│  └─────────────────────────┘   │
│                                 │
│  Version 1.0.0 (Build 1)        │
│                                 │
└─────────────────────────────────┘
Bottom Tab: [Home] [Activity] [Profile]
```

**Components**:
- Avatar (large, center)
- User name and email
- "Edit Profile" button
- List of settings options
- "Log Out" button (destructive)
- App version info (footer)

**User Flow**:
1. User taps Profile tab
2. View profile info
3. Tap "Edit Profile" to change name
4. Tap "Log Out" to sign out

**Log Out Confirmation**:
- Alert dialog: "Are you sure you want to log out?"
- Cancel / Log Out buttons

---

## Modals & Overlays

### CreateGroupModal

**Triggered from**: HomeScreen "+ New" button

**Layout**:
```
┌─────────────────────────────────┐
│  [✕]  Create Group              │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Group Name              │   │
│  │ [Bali Trip 2026       ] │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Description (optional)  │   │
│  │ [Our vacation...      ] │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Create Group            │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

---

### AddMemberModal

**Triggered from**: GroupDetailsScreen "Add Member" button

**Layout**:
```
┌─────────────────────────────────┐
│  [✕]  Add Member                │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Email Address           │   │
│  │ [jane@example.com     ] │   │
│  └─────────────────────────┘   │
│                                 │
│  An invite email will be sent   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Add Member              │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

---

## Responsive Design

### Small Screens (320-375px width)
- Reduce padding to 12px
- Font sizes scaled down by 10%
- Stack elements vertically

### Large Screens (>375px width)
- Default design (padding 16px)
- Center content if > 600px width

---

## Animations

Keep animations subtle and fast:

- **Screen transitions**: Slide animation (300ms)
- **Button press**: Scale down to 0.95 (100ms)
- **Loading spinners**: Rotate animation
- **List items**: Fade in on load (200ms)
- **Modals**: Slide up from bottom (300ms)

---

## Accessibility

- **Touch targets**: Minimum 44x44 points
- **Contrast**: WCAG AA compliant (4.5:1 for text)
- **Labels**: All inputs have labels
- **Screen reader**: Proper semantic labels
- **Focus indicators**: Visible on interactive elements

---

## Error States

**Network Error**:
```
┌─────────────────────────────────┐
│      [Offline Icon]             │
│   No internet connection        │
│   Please check your network     │
│   ┌─────────────────────────┐  │
│   │ Retry                   │  │
│   └─────────────────────────┘  │
└─────────────────────────────────┘
```

**Empty State** (No groups):
```
┌─────────────────────────────────┐
│      [Empty Box Icon]           │
│   No groups yet                 │
│   Create a group to start       │
│   splitting expenses            │
│   ┌─────────────────────────┐  │
│   │ Create Group            │  │
│   └─────────────────────────┘  │
└─────────────────────────────────┘
```

---

## Loading States

- **Skeleton screens**: For list items while loading
- **Spinner**: For button actions
- **Pull-to-refresh**: Built-in RefreshControl

---

## Offline Support (Future)

- Cache groups and balances locally
- Queue actions when offline
- Sync when back online
- Show offline banner at top

---

## Summary

Total screens: **9 core screens** + 2 modals

Estimated design/development time per screen:
- Simple screens (Login, OTP, Profile): 3-4 hours each
- Medium screens (GroupsList, Balances): 5-6 hours each
- Complex screens (AddExpense, GroupDetails): 7-8 hours each

**Total UI development time**: ~40 hours

All designs prioritize:
1. **Clarity**: Easy to understand at a glance
2. **Speed**: Fast interactions, minimal taps
3. **Simplicity**: No unnecessary features
4. **Consistency**: Reusable components
