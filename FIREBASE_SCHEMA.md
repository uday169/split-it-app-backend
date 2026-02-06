# Firebase Firestore Data Models

## Schema Design Philosophy

- **Flat but scalable**: Avoid deep nesting, use subcollections sparingly
- **Denormalization**: Store redundant data where needed for query performance
- **Server-side only**: No Firebase client SDK on mobile, all access via backend API
- **Indexes**: Defined for common query patterns
- **Timestamps**: All documents have `createdAt` and `updatedAt`

---

## Collection: `users`

**Purpose**: Store user profile information

**Document ID Strategy**: Auto-generated Firebase ID (used as userId)

### Schema

```typescript
interface User {
  id: string;                    // Same as document ID
  email: string;                 // Unique, indexed
  name: string | null;           // User's display name
  createdAt: Timestamp;          // Account creation time
  updatedAt: Timestamp;          // Last profile update
}
```

### Example Document

```json
{
  "id": "user_abc123",
  "email": "john@example.com",
  "name": "John Doe",
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-01-20T14:22:00Z"
}
```

### Indexes
- `email` (ascending, unique via backend logic)

### Business Rules
- Email cannot be changed after registration (enforce in backend)
- Name can be updated by user
- Email must be verified via OTP before user creation

---

## Collection: `emailOtps`

**Purpose**: Store OTP codes for email verification

**Document ID Strategy**: Auto-generated Firebase ID

### Schema

```typescript
interface EmailOtp {
  id: string;                    // Document ID
  email: string;                 // Email address (indexed)
  otp: string;                   // 6-digit OTP code
  expiresAt: Timestamp;          // Expiry time (5 minutes from creation)
  verified: boolean;             // Whether OTP was used
  createdAt: Timestamp;          // When OTP was generated
}
```

### Example Document

```json
{
  "id": "otp_xyz789",
  "email": "john@example.com",
  "otp": "123456",
  "expiresAt": "2026-01-15T10:35:00Z",
  "verified": false,
  "createdAt": "2026-01-15T10:30:00Z"
}
```

### Indexes
- `email` (ascending)
- Composite: `email` (ascending) + `createdAt` (descending)

### Business Rules
- OTP expires after 5 minutes
- Max 3 OTP requests per email per 15 minutes (rate limiting)
- Mark as verified after successful use
- Delete verified OTPs after 24 hours (background job)

---

## Collection: `groups`

**Purpose**: Store expense groups

**Document ID Strategy**: Auto-generated Firebase ID

### Schema

```typescript
interface Group {
  id: string;                    // Document ID
  name: string;                  // Group name (e.g., "Bali Trip 2026")
  description: string | null;    // Optional description
  createdBy: string;             // userId of creator
  memberCount: number;           // Denormalized count for quick display
  createdAt: Timestamp;          // Group creation time
  updatedAt: Timestamp;          // Last modification
}
```

### Example Document

```json
{
  "id": "group_def456",
  "name": "Bali Trip 2026",
  "description": "Our amazing Bali vacation expenses",
  "createdBy": "user_abc123",
  "memberCount": 4,
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-02-01T09:15:00Z"
}
```

### Indexes
- `createdBy` (ascending)

### Business Rules
- Group creator is automatically added as a member
- `memberCount` updated via backend when members added/removed
- Group can be deleted only if no expenses exist (or all settled)

---

## Collection: `groupMembers`

**Purpose**: Junction table for group membership

**Document ID Strategy**: Auto-generated Firebase ID

### Schema

```typescript
interface GroupMember {
  id: string;                    // Document ID
  groupId: string;               // Reference to group (indexed)
  userId: string;                // Reference to user (indexed)
  addedBy: string;               // userId who added this member
  addedAt: Timestamp;            // When member was added
  role: 'admin' | 'member';      // Role in group
}
```

### Example Document

```json
{
  "id": "gm_aaa111",
  "groupId": "group_def456",
  "userId": "user_abc123",
  "addedBy": "user_abc123",
  "addedAt": "2026-01-15T10:30:00Z",
  "role": "admin"
}
```

### Indexes
- `groupId` (ascending)
- `userId` (ascending)
- Composite: `groupId` (ascending) + `userId` (ascending) - ensures unique membership

### Business Rules
- Group creator gets 'admin' role
- Members can be added via email (backend looks up or invites)
- Admin can remove members (but not themselves if they're the last admin)
- Removing a member doesn't delete their past expense participation

---

## Collection: `expenses`

**Purpose**: Store individual expenses

**Document ID Strategy**: Auto-generated Firebase ID

### Schema

```typescript
interface Expense {
  id: string;                    // Document ID
  groupId: string;               // Group this expense belongs to (indexed)
  description: string;           // What was purchased (e.g., "Dinner at Italian")
  amount: number;                // Total expense amount (in cents to avoid floating-point)
  currency: string;              // Currency code (e.g., "USD")
  paidBy: string;                // userId who paid
  splitType: 'equal' | 'manual'; // How expense is split
  createdBy: string;             // userId who created this expense
  createdAt: Timestamp;          // Expense creation time
  updatedAt: Timestamp;          // Last modification
  date: Timestamp;               // Date of expense (user can set this)
}
```

### Example Document

```json
{
  "id": "exp_bbb222",
  "groupId": "group_def456",
  "description": "Dinner at Italian Restaurant",
  "amount": 8000,
  "currency": "USD",
  "paidBy": "user_abc123",
  "splitType": "equal",
  "createdBy": "user_abc123",
  "createdAt": "2026-02-01T19:30:00Z",
  "updatedAt": "2026-02-01T19:30:00Z",
  "date": "2026-02-01T18:00:00Z"
}
```

### Indexes
- `groupId` (ascending)
- Composite: `groupId` (ascending) + `createdAt` (descending) - for recent expenses

### Business Rules
- Amount stored in smallest currency unit (cents) to avoid floating-point errors
- `paidBy` must be a member of the group
- `date` defaults to current time but can be backdated
- Editing expense recalculates all splits and balances

---

## Collection: `expenseSplits`

**Purpose**: Store how an expense is split among members

**Document ID Strategy**: Auto-generated Firebase ID

### Schema

```typescript
interface ExpenseSplit {
  id: string;                    // Document ID
  expenseId: string;             // Reference to expense (indexed)
  groupId: string;               // Reference to group (indexed)
  userId: string;                // User who owes this split
  amount: number;                // Amount this user owes (in cents)
  createdAt: Timestamp;          // When split was created
  updatedAt: Timestamp;          // Last modification
}
```

### Example Document

```json
{
  "id": "split_ccc333",
  "expenseId": "exp_bbb222",
  "groupId": "group_def456",
  "userId": "user_xyz999",
  "amount": 2000,
  "createdAt": "2026-02-01T19:30:00Z",
  "updatedAt": "2026-02-01T19:30:00Z"
}
```

### Indexes
- `expenseId` (ascending)
- `groupId` (ascending)
- Composite: `groupId` (ascending) + `userId` (ascending)

### Business Rules
- Sum of all splits for an expense must equal the expense amount
- When expense is deleted, all splits are deleted
- For 'equal' split: amount = expense.amount / number of participants
- For 'manual' split: amounts specified individually (must sum to total)

---

## Collection: `settlements`

**Purpose**: Record settlement transactions

**Document ID Strategy**: Auto-generated Firebase ID

### Schema

```typescript
interface Settlement {
  id: string;                    // Document ID
  groupId: string;               // Group this settlement belongs to (indexed)
  paidBy: string;                // userId who made the payment
  paidTo: string;                // userId who received the payment
  amount: number;                // Amount settled (in cents)
  currency: string;              // Currency code
  status: 'pending' | 'confirmed'; // Settlement status
  notes: string | null;          // Optional notes
  createdBy: string;             // userId who recorded this settlement
  createdAt: Timestamp;          // When settlement was created
  confirmedAt: Timestamp | null; // When settlement was confirmed
  updatedAt: Timestamp;          // Last modification
}
```

### Example Document

```json
{
  "id": "settle_ddd444",
  "groupId": "group_def456",
  "paidBy": "user_xyz999",
  "paidTo": "user_abc123",
  "amount": 2000,
  "currency": "USD",
  "status": "confirmed",
  "notes": "Paid via Venmo",
  "createdBy": "user_xyz999",
  "createdAt": "2026-02-05T10:00:00Z",
  "confirmedAt": "2026-02-05T10:05:00Z",
  "updatedAt": "2026-02-05T10:05:00Z"
}
```

### Indexes
- `groupId` (ascending)
- Composite: `groupId` (ascending) + `status` (ascending)

### Business Rules
- Settlement is created by the person who owes money
- Payee must confirm the settlement (changes status to 'confirmed')
- Confirmed settlements affect balance calculations
- Cannot delete confirmed settlements (only mark as disputed - future feature)

---

## Derived Data: Group Balances

**Note**: Balances are NOT stored in a separate collection. They are calculated on-the-fly by the backend based on expenses and settlements.

### Balance Calculation Algorithm

```typescript
interface Balance {
  groupId: string;
  userId: string;
  netBalance: number;            // Positive = owed to user, Negative = user owes
  detailedBalances: Array<{      // Who owes whom
    withUserId: string;
    amount: number;              // Positive = they owe you, Negative = you owe them
  }>;
}
```

### Calculation Logic

1. **For each group**, fetch all expenses and expenseSplits
2. **For each user pair** (A, B):
   - Calculate: How much A paid for B's splits
   - Calculate: How much B paid for A's splits
   - Net: `(A paid for B) - (B paid for A)`
3. **Subtract confirmed settlements** from net amounts
4. **Return simplified balances**: Only non-zero balances

### Example Balance Response

```json
{
  "groupId": "group_def456",
  "userId": "user_abc123",
  "netBalance": 2000,
  "detailedBalances": [
    {
      "withUserId": "user_xyz999",
      "amount": 2000,
      "withUserName": "Jane Doe",
      "withUserEmail": "jane@example.com"
    }
  ]
}
```

---

## Query Patterns & Performance

### Common Queries

1. **Get user's groups**
   ```typescript
   groupMembers.where('userId', '==', userId)
   // Then fetch groups by groupId
   ```

2. **Get group members**
   ```typescript
   groupMembers.where('groupId', '==', groupId)
   ```

3. **Get group expenses (paginated)**
   ```typescript
   expenses.where('groupId', '==', groupId)
           .orderBy('createdAt', 'desc')
           .limit(20)
   ```

4. **Get expense splits**
   ```typescript
   expenseSplits.where('expenseId', '==', expenseId)
   ```

5. **Get recent OTPs for email**
   ```typescript
   emailOtps.where('email', '==', email)
            .orderBy('createdAt', 'desc')
            .limit(3)
   ```

### Performance Considerations

- **Indexes**: All queries above have composite indexes pre-created
- **Pagination**: Use cursor-based pagination for expense lists
- **Denormalization**: Store user names in balance responses to avoid extra lookups
- **Batch Operations**: Use Firestore batch writes for expense + splits creation
- **Caching**: Mobile app caches groups and balances for 5 minutes

---

## Data Consistency Rules

1. **Expense Creation**:
   - Create expense document
   - Create expenseSplits documents (batch write)
   - Update group.memberCount if new members added
   - Trigger email notifications (async)

2. **Member Removal**:
   - Check if user has unsettled balances → reject if yes
   - Delete groupMember document
   - Decrement group.memberCount
   - Keep historical expense participation intact

3. **Group Deletion**:
   - Check if all balances are zero → reject if not
   - Delete group document
   - Delete all groupMembers (batch)
   - Archive expenses (mark as deleted, don't actually delete)

---

## Backup & Recovery

- **Firebase automatic backups**: Enabled in production
- **Soft deletes**: Consider adding `deletedAt` field for important collections (future)
- **Audit logs**: Not implemented in MVP (future enhancement)

---

## Migration Strategy

If schema changes are needed:

1. Add new fields with default values
2. Run migration script (Firebase Admin SDK)
3. Update backend to use new fields
4. Remove old fields after verification

Example:
```typescript
// Migration: Add currency to old expenses
const expenses = await db.collection('expenses').get();
const batch = db.batch();
expenses.forEach(doc => {
  if (!doc.data().currency) {
    batch.update(doc.ref, { currency: 'USD' });
  }
});
await batch.commit();
```

---

## Security Rules (Reference)

**Note**: Since we're using backend-only access via Firebase Admin SDK, Firestore security rules are set to deny all client access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Deny all client access - all operations via backend API
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

All authorization is handled in backend API middleware.
