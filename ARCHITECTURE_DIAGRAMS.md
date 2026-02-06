# Architecture Diagrams

This document contains visual architecture diagrams using Mermaid syntax. GitHub will render these automatically.

## System Architecture Overview

```mermaid
graph TB
    subgraph "Mobile App (React Native + Expo)"
        A[Auth Screens]
        B[Group Screens]
        C[Expense Screens]
        D[Balance Screens]
        E[API Client + React Query]
        
        A --> E
        B --> E
        C --> E
        D --> E
    end
    
    subgraph "Backend (Node.js + Express)"
        F[API Routes]
        G[Controllers]
        H[Services]
        I[Repositories]
        J[Middleware]
        
        F --> G
        G --> H
        H --> I
        J --> F
    end
    
    subgraph "External Services"
        K[(Firebase Firestore)]
        L[SMTP Server]
    end
    
    E -->|HTTPS + JWT| F
    I -->|Firebase Admin SDK| K
    H -->|Nodemailer| L
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant M as Mobile App
    participant B as Backend API
    participant DB as Firestore
    participant E as Email Service

    U->>M: Enter email
    M->>B: POST /auth/send-otp
    B->>B: Generate 6-digit OTP
    B->>DB: Save OTP with expiry
    B->>E: Send OTP email
    B-->>M: Success response
    M-->>U: "OTP sent to your email"
    
    U->>M: Enter OTP
    M->>B: POST /auth/verify-otp
    B->>DB: Validate OTP
    alt OTP valid
        B->>DB: Get/Create user
        B->>B: Generate JWT token
        B-->>M: Return JWT + user info
        M->>M: Store JWT securely
        M-->>U: Navigate to home
    else OTP invalid
        B-->>M: Error response
        M-->>U: "Invalid OTP"
    end
```

## Expense Creation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant M as Mobile App
    participant B as Backend API
    participant DB as Firestore
    participant E as Email Service

    U->>M: Fill expense form
    M->>M: Validate with Zod
    M->>B: POST /expenses (with JWT)
    B->>B: Verify JWT
    B->>B: Validate request
    
    rect rgb(200, 220, 250)
        Note right of B: Transaction
        B->>DB: Create expense doc
        B->>DB: Create split docs (batch)
        B->>DB: Update group metadata
    end
    
    B->>B: Trigger email notifications
    B-->>M: Success + expense data
    
    par Email notifications
        B->>E: Send email to members
    end
    
    M->>M: Invalidate balances cache
    M-->>U: Show success + navigate back
```

## Balance Calculation Flow

```mermaid
graph TD
    A[User requests balances] --> B[Fetch all expenses]
    B --> C[Fetch all expense splits]
    C --> D[Fetch all confirmed settlements]
    
    D --> E{For each member pair A, B}
    E --> F[Calculate: A paid for B's splits]
    E --> G[Calculate: B paid for A's splits]
    
    F --> H[Net = A_paid_for_B - B_paid_for_A]
    G --> H
    
    H --> I[Subtract confirmed settlements]
    I --> J{Net balance != 0?}
    
    J -->|Yes| K[Add to balances list]
    J -->|No| L[Skip this pair]
    
    K --> M[Return simplified balances]
    L --> M
```

## Data Model Relationships

```mermaid
erDiagram
    USERS ||--o{ GROUP_MEMBERS : "member of"
    USERS ||--o{ EXPENSES : "created by"
    USERS ||--o{ SETTLEMENTS : "paid by / paid to"
    
    GROUPS ||--o{ GROUP_MEMBERS : "has"
    GROUPS ||--o{ EXPENSES : "contains"
    GROUPS ||--o{ SETTLEMENTS : "records"
    
    EXPENSES ||--o{ EXPENSE_SPLITS : "split into"
    
    USERS {
        string id PK
        string email UK
        string name
        timestamp createdAt
    }
    
    GROUPS {
        string id PK
        string name
        string createdBy FK
        int memberCount
        timestamp createdAt
    }
    
    GROUP_MEMBERS {
        string id PK
        string groupId FK
        string userId FK
        string role
        timestamp addedAt
    }
    
    EXPENSES {
        string id PK
        string groupId FK
        string description
        int amount
        string paidBy FK
        string splitType
        timestamp date
    }
    
    EXPENSE_SPLITS {
        string id PK
        string expenseId FK
        string userId FK
        int amount
    }
    
    SETTLEMENTS {
        string id PK
        string groupId FK
        string paidBy FK
        string paidTo FK
        int amount
        string status
        timestamp confirmedAt
    }
```

## Component Architecture (Mobile)

```mermaid
graph TB
    subgraph "Screens Layer"
        S1[LoginScreen]
        S2[GroupsListScreen]
        S3[GroupDetailsScreen]
        S4[AddExpenseScreen]
        S5[BalancesScreen]
    end
    
    subgraph "Hooks Layer (React Query)"
        H1[useAuth]
        H2[useGroups]
        H3[useExpenses]
        H4[useBalances]
    end
    
    subgraph "API Layer"
        A1[auth.api]
        A2[group.api]
        A3[expense.api]
        A4[balance.api]
    end
    
    subgraph "HTTP Client"
        C[Axios Instance]
    end
    
    S1 --> H1
    S2 --> H2
    S3 --> H2
    S3 --> H3
    S4 --> H3
    S5 --> H4
    
    H1 --> A1
    H2 --> A2
    H3 --> A3
    H4 --> A4
    
    A1 --> C
    A2 --> C
    A3 --> C
    A4 --> C
    
    C -->|HTTPS + JWT| Backend
```

## Backend Layered Architecture

```mermaid
graph LR
    subgraph "API Layer"
        R[Routes]
        C[Controllers]
    end
    
    subgraph "Business Layer"
        S[Services]
    end
    
    subgraph "Data Layer"
        RE[Repositories]
    end
    
    subgraph "Middleware"
        M1[Auth]
        M2[Validation]
        M3[Error Handler]
        M4[Logger]
    end
    
    subgraph "External"
        DB[(Firestore)]
        EM[Email Service]
    end
    
    M1 --> R
    M2 --> R
    M4 --> R
    R --> C
    C --> S
    S --> RE
    S --> EM
    RE --> DB
    C --> M3
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Mobile Devices"
        M1[Android Phone]
        M2[Android Tablet]
    end
    
    subgraph "Railway / Render"
        B[Node.js Backend<br/>Express Server<br/>Port 3000]
    end
    
    subgraph "Firebase"
        F[(Firestore Database)]
    end
    
    subgraph "Email Provider"
        E[SMTP Server<br/>SendGrid/SES/Mailgun]
    end
    
    M1 -->|HTTPS| B
    M2 -->|HTTPS| B
    B -->|Firebase Admin SDK| F
    B -->|SMTP| E
    E -->|Email| Users
```

## Settlement Confirmation Flow

```mermaid
stateDiagram-v2
    [*] --> Pending: User records payment
    
    Pending --> Confirmed: Payee confirms
    Pending --> Cancelled: Payer cancels
    
    Confirmed --> [*]: Affects balances
    Cancelled --> [*]: No balance change
    
    note right of Pending
        Notification sent to payee
        "John paid you $20"
    end note
    
    note right of Confirmed
        Notification sent to payer
        "Jane confirmed your payment"
    end note
```

## Group Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Created: User creates group
    
    Created --> Active: Members added
    Active --> Active: Expenses added
    Active --> Settling: Some balances settled
    Settling --> Active: New expenses added
    Settling --> Settled: All balances zero
    
    Active --> Archived: No activity (future)
    Settled --> Archived: No activity (future)
    Archived --> [*]
    
    note right of Created
        Creator is admin
        Group has 1 member
    end note
    
    note right of Settled
        All balances = 0
        Can be deleted safely
    end note
```

## Error Handling Flow

```mermaid
graph TD
    A[Request to API] --> B{Valid JWT?}
    B -->|No| C[401 Unauthorized]
    B -->|Yes| D{Valid input?}
    
    D -->|No| E[400 Bad Request]
    D -->|Yes| F{User authorized?}
    
    F -->|No| G[403 Forbidden]
    F -->|Yes| H{Resource exists?}
    
    H -->|No| I[404 Not Found]
    H -->|Yes| J{Business logic valid?}
    
    J -->|No| K[409 Conflict]
    J -->|Yes| L{Database operation}
    
    L -->|Success| M[200/201 Success]
    L -->|Error| N[500 Internal Error]
    
    C --> O[Error Middleware]
    E --> O
    G --> O
    I --> O
    K --> O
    N --> O
    
    O --> P[Log error]
    P --> Q[Format error response]
    Q --> R[Return to client]
```

## Mobile App State Management

```mermaid
graph TD
    subgraph "React Query Cache"
        QC1[Groups Query]
        QC2[Expenses Query]
        QC3[Balances Query]
    end
    
    subgraph "Local Storage"
        LS1[JWT Token<br/>Expo SecureStore]
    end
    
    subgraph "Component State"
        CS1[Form State<br/>React Hook Form]
        CS2[UI State<br/>useState]
    end
    
    A[User Action] --> CS1
    CS1 --> B{Form valid?}
    B -->|Yes| C[Trigger mutation]
    B -->|No| D[Show errors]
    
    C --> E[API call]
    E --> F{Success?}
    
    F -->|Yes| G[Invalidate queries]
    F -->|No| H[Show error]
    
    G --> QC1
    G --> QC2
    G --> QC3
    
    QC1 --> I[Re-fetch data]
    QC2 --> I
    QC3 --> I
    
    I --> J[Update UI]
```

## API Rate Limiting

```mermaid
sequenceDiagram
    participant C as Client
    participant RL as Rate Limiter
    participant API as API Handler

    C->>RL: Request 1
    RL->>RL: Check rate (OK)
    RL->>API: Forward request
    API-->>RL: Response
    RL-->>C: 200 OK
    
    C->>RL: Request 2
    RL->>RL: Check rate (OK)
    RL->>API: Forward request
    API-->>RL: Response
    RL-->>C: 200 OK
    
    C->>RL: Request 3
    RL->>RL: Check rate (OK)
    RL->>API: Forward request
    API-->>RL: Response
    RL-->>C: 200 OK
    
    C->>RL: Request 4
    RL->>RL: Check rate (EXCEEDED)
    RL-->>C: 429 Too Many Requests
    
    Note over C,API: OTP endpoint: 3 requests per 15 min<br/>Other endpoints: 100 per 5 min
```

## Future: Multi-Currency Support

```mermaid
graph TD
    A[Expense in EUR] --> B[Store original currency]
    B --> C[Fetch exchange rate]
    C --> D[Convert to base currency USD]
    D --> E[Calculate splits in USD]
    
    E --> F{Display preference?}
    F -->|User prefers EUR| G[Convert back to EUR]
    F -->|User prefers USD| H[Show in USD]
    
    G --> I[Display: €50.00]
    H --> J[Display: $55.00]
    
    K[Exchange Rate API] --> C
    
    style A fill:#f9f,stroke:#333
    style K fill:#ff9,stroke:#333
```

---

## Diagram Notes

All diagrams use Mermaid syntax and will be rendered automatically on GitHub. 

To view locally:
- Use Mermaid Live Editor: https://mermaid.live/
- Or install a Markdown viewer with Mermaid support

These diagrams complement the textual architecture in [ARCHITECTURE.md](ARCHITECTURE.md).
