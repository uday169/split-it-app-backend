# API Contract Specification

## Base URL

```
Development: http://localhost:3000/api/v1
Production: https://api.splitit.example.com/api/v1
```

## Authentication

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Standard Response Format

### Success Response

```json
{
  "success": true,
  "data": { /* response data */ }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_INPUT` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT token |
| `FORBIDDEN` | 403 | User lacks permission |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `INVALID_OTP` | 400 | OTP is incorrect or expired |
| `OTP_RATE_LIMIT` | 429 | Too many OTP requests |

---

## API Endpoints

### 1. Authentication

#### 1.1 Send OTP

**Endpoint**: `POST /auth/send-otp`

**Auth Required**: No

**Description**: Generates and sends OTP to user's email

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Validation**:
- `email`: Valid email format, required

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "OTP sent to your email",
    "expiresIn": 300
  }
}
```

**Error Cases**:
- `INVALID_INPUT` (400): Invalid email format
- `OTP_RATE_LIMIT` (429): More than 3 requests in 15 minutes
- `INTERNAL_ERROR` (500): Email sending failed

---

#### 1.2 Verify OTP

**Endpoint**: `POST /auth/verify-otp`

**Auth Required**: No

**Description**: Verifies OTP and issues JWT token

**Request Body**:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Validation**:
- `email`: Valid email format, required
- `otp`: 6-digit string, required

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 2592000,
    "user": {
      "id": "user_abc123",
      "email": "john@example.com",
      "name": "John Doe"
    }
  }
}
```

**Error Cases**:
- `INVALID_INPUT` (400): Invalid email or OTP format
- `INVALID_OTP` (400): OTP incorrect or expired
- `INTERNAL_ERROR` (500): Token generation failed

**Notes**:
- Creates user if first login
- Returns existing user if already registered
- OTP is marked as verified after successful validation

---

#### 1.3 Refresh Token

**Endpoint**: `POST /auth/refresh-token`

**Auth Required**: Yes (expired token accepted)

**Description**: Issues a new JWT token (future feature, not in MVP)

---

### 2. User Management

#### 2.1 Get User Profile

**Endpoint**: `GET /users/me`

**Auth Required**: Yes

**Description**: Returns authenticated user's profile

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "user_abc123",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid or missing JWT

---

#### 2.2 Update User Profile

**Endpoint**: `PATCH /users/me`

**Auth Required**: Yes

**Description**: Updates user's name

**Request Body**:
```json
{
  "name": "John Smith"
}
```

**Validation**:
- `name`: String, 1-100 characters, required

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "user_abc123",
    "email": "john@example.com",
    "name": "John Smith",
    "updatedAt": "2026-02-06T14:30:00Z"
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid JWT
- `INVALID_INPUT` (400): Validation failed

---

### 3. Group Management

#### 3.1 Create Group

**Endpoint**: `POST /groups`

**Auth Required**: Yes

**Description**: Creates a new expense group

**Request Body**:
```json
{
  "name": "Bali Trip 2026",
  "description": "Our amazing Bali vacation expenses"
}
```

**Validation**:
- `name`: String, 1-100 characters, required
- `description`: String, 0-500 characters, optional

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "group_def456",
    "name": "Bali Trip 2026",
    "description": "Our amazing Bali vacation expenses",
    "createdBy": "user_abc123",
    "memberCount": 1,
    "createdAt": "2026-01-15T10:30:00Z",
    "updatedAt": "2026-01-15T10:30:00Z"
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid JWT
- `INVALID_INPUT` (400): Validation failed

**Notes**:
- Creator is automatically added as admin member

---

#### 3.2 List User's Groups

**Endpoint**: `GET /groups`

**Auth Required**: Yes

**Description**: Lists all groups user is a member of

**Query Parameters**:
- `page`: Number, default 1
- `limit`: Number, default 20, max 100

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "groups": [
      {
        "id": "group_def456",
        "name": "Bali Trip 2026",
        "description": "Our amazing Bali vacation expenses",
        "createdBy": "user_abc123",
        "memberCount": 4,
        "createdAt": "2026-01-15T10:30:00Z",
        "updatedAt": "2026-02-01T09:15:00Z",
        "userRole": "admin"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "hasMore": false
    }
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid JWT

---

#### 3.3 Get Group Details

**Endpoint**: `GET /groups/:groupId`

**Auth Required**: Yes

**Description**: Get detailed information about a group

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "group_def456",
    "name": "Bali Trip 2026",
    "description": "Our amazing Bali vacation expenses",
    "createdBy": "user_abc123",
    "memberCount": 4,
    "createdAt": "2026-01-15T10:30:00Z",
    "updatedAt": "2026-02-01T09:15:00Z",
    "members": [
      {
        "userId": "user_abc123",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "admin",
        "addedAt": "2026-01-15T10:30:00Z"
      },
      {
        "userId": "user_xyz999",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "member",
        "addedAt": "2026-01-16T11:00:00Z"
      }
    ]
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid JWT
- `FORBIDDEN` (403): User not a member of group
- `NOT_FOUND` (404): Group doesn't exist

---

#### 3.4 Update Group

**Endpoint**: `PATCH /groups/:groupId`

**Auth Required**: Yes (admin only)

**Description**: Update group name or description

**Request Body**:
```json
{
  "name": "Bali Trip 2026 - Updated",
  "description": "New description"
}
```

**Validation**:
- `name`: String, 1-100 characters, optional
- `description`: String, 0-500 characters, optional

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "group_def456",
    "name": "Bali Trip 2026 - Updated",
    "description": "New description",
    "updatedAt": "2026-02-06T14:30:00Z"
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid JWT
- `FORBIDDEN` (403): User is not admin
- `NOT_FOUND` (404): Group doesn't exist
- `INVALID_INPUT` (400): Validation failed

---

#### 3.5 Delete Group

**Endpoint**: `DELETE /groups/:groupId`

**Auth Required**: Yes (admin only)

**Description**: Deletes a group (only if no unsettled balances)

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Group deleted successfully"
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid JWT
- `FORBIDDEN` (403): User is not admin or group has unsettled balances
- `NOT_FOUND` (404): Group doesn't exist

---

#### 3.6 Add Member to Group

**Endpoint**: `POST /groups/:groupId/members`

**Auth Required**: Yes (admin only)

**Description**: Add a member to the group by email

**Request Body**:
```json
{
  "email": "jane@example.com"
}
```

**Validation**:
- `email`: Valid email format, required

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "groupId": "group_def456",
    "member": {
      "userId": "user_xyz999",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "member",
      "addedAt": "2026-02-06T14:30:00Z"
    }
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid JWT
- `FORBIDDEN` (403): User is not admin
- `NOT_FOUND` (404): Group doesn't exist
- `CONFLICT` (409): User already a member
- `INVALID_INPUT` (400): Invalid email

**Notes**:
- If email doesn't exist, user is created with null name
- Email notification sent to new member

---

#### 3.7 Remove Member from Group

**Endpoint**: `DELETE /groups/:groupId/members/:userId`

**Auth Required**: Yes (admin only)

**Description**: Remove a member from the group

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Member removed successfully"
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid JWT
- `FORBIDDEN` (403): User is not admin, or member has unsettled balance
- `NOT_FOUND` (404): Group or member doesn't exist
- `CONFLICT` (409): Cannot remove last admin

---

### 4. Expense Management

#### 4.1 Create Expense

**Endpoint**: `POST /expenses`

**Auth Required**: Yes

**Description**: Add an expense to a group

**Request Body**:
```json
{
  "groupId": "group_def456",
  "description": "Dinner at Italian Restaurant",
  "amount": 8000,
  "currency": "USD",
  "paidBy": "user_abc123",
  "splitType": "equal",
  "date": "2026-02-01T18:00:00Z",
  "splitDetails": [
    {
      "userId": "user_abc123",
      "amount": 2000
    },
    {
      "userId": "user_xyz999",
      "amount": 2000
    },
    {
      "userId": "user_aaa111",
      "amount": 2000
    },
    {
      "userId": "user_bbb222",
      "amount": 2000
    }
  ]
}
```

**Validation**:
- `groupId`: String, required
- `description`: String, 1-200 characters, required
- `amount`: Positive integer (in cents), required
- `currency`: String (ISO code), default "USD"
- `paidBy`: String (userId), required, must be group member
- `splitType`: Enum ('equal' | 'manual'), required
- `date`: ISO timestamp, optional (defaults to now)
- `splitDetails`: Array of {userId, amount}, required
  - Sum of amounts must equal total amount
  - All userIds must be group members

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "exp_bbb222",
    "groupId": "group_def456",
    "description": "Dinner at Italian Restaurant",
    "amount": 8000,
    "currency": "USD",
    "paidBy": "user_abc123",
    "splitType": "equal",
    "date": "2026-02-01T18:00:00Z",
    "createdAt": "2026-02-01T19:30:00Z",
    "splits": [
      {
        "userId": "user_abc123",
        "amount": 2000,
        "userName": "John Doe"
      },
      {
        "userId": "user_xyz999",
        "amount": 2000,
        "userName": "Jane Smith"
      }
    ]
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid JWT
- `FORBIDDEN` (403): User not a member of group
- `NOT_FOUND` (404): Group doesn't exist
- `INVALID_INPUT` (400): Validation failed (splits don't sum, invalid users, etc.)

**Notes**:
- Email notifications sent to all members except creator
- Balance calculation triggered after creation

---

#### 4.2 List Group Expenses

**Endpoint**: `GET /groups/:groupId/expenses`

**Auth Required**: Yes

**Description**: List expenses for a group

**Query Parameters**:
- `page`: Number, default 1
- `limit`: Number, default 20, max 100

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "expenses": [
      {
        "id": "exp_bbb222",
        "description": "Dinner at Italian Restaurant",
        "amount": 8000,
        "currency": "USD",
        "paidBy": {
          "userId": "user_abc123",
          "name": "John Doe"
        },
        "date": "2026-02-01T18:00:00Z",
        "createdAt": "2026-02-01T19:30:00Z",
        "splitCount": 4
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "hasMore": false
    }
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid JWT
- `FORBIDDEN` (403): User not a member of group
- `NOT_FOUND` (404): Group doesn't exist

---

#### 4.3 Get Expense Details

**Endpoint**: `GET /expenses/:expenseId`

**Auth Required**: Yes

**Description**: Get detailed information about an expense

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "exp_bbb222",
    "groupId": "group_def456",
    "description": "Dinner at Italian Restaurant",
    "amount": 8000,
    "currency": "USD",
    "paidBy": {
      "userId": "user_abc123",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "splitType": "equal",
    "date": "2026-02-01T18:00:00Z",
    "createdAt": "2026-02-01T19:30:00Z",
    "splits": [
      {
        "userId": "user_abc123",
        "userName": "John Doe",
        "amount": 2000
      },
      {
        "userId": "user_xyz999",
        "userName": "Jane Smith",
        "amount": 2000
      }
    ]
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid JWT
- `FORBIDDEN` (403): User not a member of group
- `NOT_FOUND` (404): Expense doesn't exist

---

#### 4.4 Update Expense

**Endpoint**: `PATCH /expenses/:expenseId`

**Auth Required**: Yes (creator or admin only)

**Description**: Update expense details

**Request Body**:
```json
{
  "description": "Updated description",
  "amount": 9000,
  "splitDetails": [
    {
      "userId": "user_abc123",
      "amount": 4500
    },
    {
      "userId": "user_xyz999",
      "amount": 4500
    }
  ]
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "exp_bbb222",
    "description": "Updated description",
    "amount": 9000,
    "updatedAt": "2026-02-06T14:30:00Z"
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid JWT
- `FORBIDDEN` (403): User is not creator or admin
- `NOT_FOUND` (404): Expense doesn't exist
- `INVALID_INPUT` (400): Validation failed

**Notes**:
- Balance recalculation triggered
- Email notification sent to group members

---

#### 4.5 Delete Expense

**Endpoint**: `DELETE /expenses/:expenseId`

**Auth Required**: Yes (creator or admin only)

**Description**: Delete an expense

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Expense deleted successfully"
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid JWT
- `FORBIDDEN` (403): User is not creator or admin
- `NOT_FOUND` (404): Expense doesn't exist

**Notes**:
- All splits deleted
- Balance recalculation triggered

---

### 5. Balance Management

#### 5.1 Get Group Balances

**Endpoint**: `GET /groups/:groupId/balances`

**Auth Required**: Yes

**Description**: Calculate and return balances for all group members

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "groupId": "group_def456",
    "balances": [
      {
        "userId": "user_abc123",
        "userName": "John Doe",
        "netBalance": 2000,
        "owes": [],
        "owedBy": [
          {
            "userId": "user_xyz999",
            "userName": "Jane Smith",
            "amount": 2000
          }
        ]
      },
      {
        "userId": "user_xyz999",
        "userName": "Jane Smith",
        "netBalance": -2000,
        "owes": [
          {
            "userId": "user_abc123",
            "userName": "John Doe",
            "amount": 2000
          }
        ],
        "owedBy": []
      }
    ],
    "totalOwed": 2000,
    "isBalanced": false
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid JWT
- `FORBIDDEN` (403): User not a member of group
- `NOT_FOUND` (404): Group doesn't exist

**Notes**:
- Calculated in real-time from expenses and settlements
- Positive netBalance = owed to user
- Negative netBalance = user owes

---

#### 5.2 Get User Balance in Group

**Endpoint**: `GET /groups/:groupId/balances/me`

**Auth Required**: Yes

**Description**: Get authenticated user's balance in the group

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "userId": "user_xyz999",
    "groupId": "group_def456",
    "netBalance": -2000,
    "owes": [
      {
        "userId": "user_abc123",
        "userName": "John Doe",
        "email": "john@example.com",
        "amount": 2000
      }
    ],
    "owedBy": []
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid JWT
- `FORBIDDEN` (403): User not a member of group
- `NOT_FOUND` (404): Group doesn't exist

---

### 6. Settlement Management

#### 6.1 Record Settlement

**Endpoint**: `POST /settlements`

**Auth Required**: Yes

**Description**: Record a settlement transaction

**Request Body**:
```json
{
  "groupId": "group_def456",
  "paidTo": "user_abc123",
  "amount": 2000,
  "currency": "USD",
  "notes": "Paid via Venmo"
}
```

**Validation**:
- `groupId`: String, required
- `paidTo`: String (userId), required
- `amount`: Positive integer (in cents), required
- `currency`: String (ISO code), default "USD"
- `notes`: String, 0-200 characters, optional

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "settle_ddd444",
    "groupId": "group_def456",
    "paidBy": "user_xyz999",
    "paidTo": "user_abc123",
    "amount": 2000,
    "currency": "USD",
    "status": "pending",
    "notes": "Paid via Venmo",
    "createdAt": "2026-02-05T10:00:00Z"
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid JWT
- `FORBIDDEN` (403): User not a member of group
- `NOT_FOUND` (404): Group doesn't exist
- `INVALID_INPUT` (400): Validation failed, or amount exceeds owed amount

**Notes**:
- `paidBy` is the authenticated user
- Email notification sent to `paidTo` user
- Settlement status is 'pending' until confirmed

---

#### 6.2 Confirm Settlement

**Endpoint**: `PATCH /settlements/:settlementId/confirm`

**Auth Required**: Yes (paidTo user only)

**Description**: Confirm receipt of settlement

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "settle_ddd444",
    "status": "confirmed",
    "confirmedAt": "2026-02-05T10:05:00Z"
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid JWT
- `FORBIDDEN` (403): User is not the payee
- `NOT_FOUND` (404): Settlement doesn't exist
- `CONFLICT` (409): Settlement already confirmed

**Notes**:
- Only payee can confirm
- Confirmation affects balance calculation
- Email notification sent to payer

---

#### 6.3 List Group Settlements

**Endpoint**: `GET /groups/:groupId/settlements`

**Auth Required**: Yes

**Description**: List settlements for a group

**Query Parameters**:
- `status`: 'pending' | 'confirmed' | 'all', default 'all'
- `page`: Number, default 1
- `limit`: Number, default 20, max 100

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "settlements": [
      {
        "id": "settle_ddd444",
        "paidBy": {
          "userId": "user_xyz999",
          "name": "Jane Smith"
        },
        "paidTo": {
          "userId": "user_abc123",
          "name": "John Doe"
        },
        "amount": 2000,
        "currency": "USD",
        "status": "confirmed",
        "notes": "Paid via Venmo",
        "createdAt": "2026-02-05T10:00:00Z",
        "confirmedAt": "2026-02-05T10:05:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "hasMore": false
    }
  }
}
```

**Error Cases**:
- `UNAUTHORIZED` (401): Invalid JWT
- `FORBIDDEN` (403): User not a member of group
- `NOT_FOUND` (404): Group doesn't exist

---

### 7. Health & Utility

#### 7.1 Health Check

**Endpoint**: `GET /health`

**Auth Required**: No

**Description**: Check server and database health

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-02-06T14:30:00Z",
    "services": {
      "database": "connected",
      "email": "connected"
    }
  }
}
```

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `POST /auth/send-otp` | 3 requests per 15 minutes per email |
| All other endpoints | 100 requests per 5 minutes per IP |

---

## Pagination

All list endpoints support cursor-based pagination:

**Request**:
```
GET /groups?page=1&limit=20
```

**Response**:
```json
{
  "data": { /* ... */ },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "hasMore": true
  }
}
```

---

## Sorting

Expenses are sorted by `createdAt` descending (most recent first) by default.

---

## Webhook Events (Future)

Not implemented in MVP. Future endpoints:
- `POST /webhooks/email-bounce`
- `POST /webhooks/email-opened`

---

## Versioning

API is versioned in the URL path: `/api/v1/...`

Breaking changes will increment the version number.
