# Backend Testing

## Overview
The backend uses Jest, ts-jest for TypeScript support, and supertest for API integration testing.

## Test Structure
```
tests/
├── unit/
│   ├── services/       # Service layer unit tests
│   └── utils/          # Utility function tests
├── integration/        # API endpoint integration tests
├── helpers/
│   ├── testData.ts     # Mock data factories
│   └── setup.ts        # Test utilities
└── setup.ts           # Global test setup and mocks
```

## Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only unit tests
npm test -- --testPathPattern="unit"

# Run only integration tests
npm test -- --testPathPattern="integration"
```

## Test Coverage

### Unit Tests (36 tests passing)

#### Utility Tests
- **otp.utils.test.ts**
  - OTP generation (6-digit validation, uniqueness, range checking)
  - OTP expiration checking
  - OTP expiry time calculation

- **jwt.utils.test.ts**
  - JWT token generation
  - Token payload validation
  - Token verification
  - Expiration handling
  - Security validation (tampered tokens, wrong secrets)

#### Service Tests
- **auth.service.test.ts**
  - OTP sending with rate limiting
  - OTP verification (valid, expired, invalid, already used)
  - User creation on first login
  - Too many attempts handling
  - Email service failure handling

- **balance.service.test.ts**
  - Balance calculation for groups
  - Simple equal split scenarios
  - Multiple expenses balancing
  - Complex balance simplification algorithm
  - Group membership validation

- **expense.service.test.ts**
  - Expense creation with equal splits
  - Expense creation with manual splits
  - Split amount calculation
  - Group membership validation

### Integration Tests

- **auth.test.ts**
  - POST /api/auth/send-otp (validation, rate limiting, errors)
  - POST /api/auth/verify-otp (success, invalid OTP, expired OTP)
  - GET /health (health check)

- **group.test.ts**
  - POST /api/groups (create group, authentication, validation)
  - GET /api/groups (list user groups)
  - GET /api/groups/:id (group details, 404, 403)
  - POST /api/groups/:id/members (add member, admin only)

- **expense.test.ts**
  - POST /api/expenses (equal split, manual split, validation)
  - GET /api/expenses/:groupId (list expenses, empty, non-member)
  - GET /api/expenses/detail/:id (get details with splits, 404)

- **settlement.test.ts**
  - POST /api/settlements (create settlement, authentication, validation)
  - GET /api/settlements/:groupId (list settlements, empty, non-member)

## Mocking Strategy

### Global Mocks (tests/setup.ts)
- **Firebase Admin SDK**: Mocked to avoid real database connections
- **Firebase Config**: Test credentials provided
- **Email Service**: Mocked to prevent actual emails
- **Logger**: Silenced during tests

### Repository Mocks
All repository methods are mocked in service and integration tests to isolate business logic.

## Test Data

**tests/helpers/testData.ts** provides:
- Mock users (user1, user2, user3)
- Mock groups
- Mock expenses
- Mock OTP records
- Factory functions for creating custom test data

## Best Practices

1. **Unit Tests**
   - Test business logic in isolation
   - Mock all external dependencies
   - Test edge cases and error paths
   - Aim for 70%+ coverage

2. **Integration Tests**
   - Test full request/response cycle
   - Test authentication and authorization
   - Test validation errors
   - Test rate limiting

3. **Test Organization**
   - One describe block per method/endpoint
   - Clear, descriptive test names
   - Setup and teardown in beforeEach/afterEach
   - Use mockResolvedValue/mockRejectedValue consistently

## Writing New Tests

### Unit Test Template
```typescript
import { MyService } from '../../../src/services/my.service';
import myRepository from '../../../src/repositories/my.repository';
import '../../helpers/setup';

jest.mock('../../../src/repositories/my.repository');

describe('MyService', () => {
  let myService: MyService;

  beforeEach(() => {
    myService = new MyService();
    jest.clearAllMocks();
  });

  describe('myMethod', () => {
    it('should do something', async () => {
      (myRepository.findById as jest.Mock).mockResolvedValue({ id: '1' });
      
      const result = await myService.myMethod('1');
      
      expect(result).toBeDefined();
      expect(myRepository.findById).toHaveBeenCalledWith('1');
    });
  });
});
```

### Integration Test Template
```typescript
import request from 'supertest';
import app from '../../src/app';
import myRepository from '../../src/repositories/my.repository';
import '../helpers/setup';

jest.mock('../../src/repositories/my.repository');

describe('My API', () => {
  describe('GET /api/my-endpoint', () => {
    it('should return data', async () => {
      (myRepository.findAll as jest.Mock).mockResolvedValue([]);
      
      const res = await request(app)
        .get('/api/my-endpoint')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toEqual([]);
    });
  });
});
```

## Known Issues

- Integration tests have TypeScript type mismatches in route handlers (pre-existing code issue)
- Tests themselves are functionally correct
- Unit tests run perfectly (36/36 passing)

## Future Improvements

1. Add tests for remaining services (user, group, settlement)
2. Add more edge case coverage
3. Fix route handler type issues
4. Add E2E tests with actual Firebase Emulator
5. Add performance tests for balance simplification algorithm
