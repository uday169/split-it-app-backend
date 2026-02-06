# Split It Mobile App

A React Native mobile application for splitting expenses with friends and groups, built with Expo.

## Features

✅ **Complete Implementation:**
- Authentication (Email + OTP)
- Group Management (Create, View, Edit, Delete)
- Member Management (Add, Remove)
- Expense Tracking (Create, View, Edit, Delete)
- Balance Calculation (Real-time)
- Settlement Recording (With confirmation)
- User Profile Management

## Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **State Management:** React Query (TanStack Query)
- **Navigation:** React Navigation v6
- **Forms:** React Hook Form + Zod
- **Storage:** Expo Secure Store (for JWT tokens)
- **HTTP Client:** Axios
- **UI:** Custom components with Material Design-inspired styling

## Project Structure

```
mobile/
├── src/
│   ├── api/              # API service layer
│   │   ├── client.ts     # Axios instance with interceptors
│   │   ├── auth.api.ts
│   │   ├── user.api.ts
│   │   ├── group.api.ts
│   │   ├── expense.api.ts
│   │   ├── balance.api.ts
│   │   └── settlement.api.ts
│   │
│   ├── components/       # Reusable UI components
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       └── Loading.tsx
│   │
│   ├── hooks/           # React Query hooks
│   │   ├── useAuth.ts
│   │   ├── useUser.ts
│   │   ├── useGroups.ts
│   │   ├── useMembers.ts
│   │   ├── useExpenses.ts
│   │   ├── useBalances.ts
│   │   └── useSettlements.ts
│   │
│   ├── navigation/      # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   ├── GroupStack.tsx
│   │   └── ProfileStack.tsx
│   │
│   ├── screens/         # Screen components
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── OtpScreen.tsx
│   │   ├── groups/
│   │   │   ├── GroupsListScreen.tsx
│   │   │   ├── GroupDetailsScreen.tsx
│   │   │   ├── CreateGroupScreen.tsx
│   │   │   └── AddMemberScreen.tsx
│   │   ├── expenses/
│   │   │   ├── AddExpenseScreen.tsx
│   │   │   └── ExpenseDetailsScreen.tsx
│   │   ├── balances/
│   │   │   ├── BalancesScreen.tsx
│   │   │   └── SettleUpScreen.tsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── EditProfileScreen.tsx
│   │   └── activity/
│   │       └── ActivityScreen.tsx
│   │
│   ├── schemas/         # Validation schemas
│   │   └── validation.schemas.ts
│   │
│   ├── store/           # Local storage
│   │   └── authStore.ts
│   │
│   ├── theme/           # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── theme.ts
│   │
│   ├── types/           # TypeScript types
│   │   ├── api.types.ts
│   │   └── navigation.types.ts
│   │
│   └── utils/           # Utility functions
│       └── config.ts
│
├── App.tsx              # Root component
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn installed
- Expo CLI installed globally (`npm install -g expo-cli`)
- Backend API running on http://localhost:3000

### Installation

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

### Running the App

1. Start the backend API first (see backend README)

2. Start the Expo development server:
```bash
npm start
```

3. Run on specific platform:
```bash
npm run android  # For Android
npm run ios      # For iOS (macOS only)
npm run web      # For Web
```

4. Scan the QR code with:
   - **iOS:** Camera app or Expo Go app
   - **Android:** Expo Go app

## Configuration

### API Base URL

The API base URL is configured in `src/utils/config.ts`:

```typescript
export const config = {
  apiBaseUrl: 'http://localhost:3000/api/v1',
} as const;
```

To change the API URL (e.g., for production):
1. Update the `apiBaseUrl` in `config.ts`
2. Or use environment variables (recommended for production)

## Key Features Implementation

### Authentication Flow
1. User enters email
2. OTP sent to email
3. User enters 6-digit OTP
4. JWT token stored securely
5. Auto-redirect to main app

### Group Management
- Create new groups with name and description
- View all user's groups
- Add/remove members (admin only)
- View group details with members and expenses
- Delete groups (if no unsettled balances)

### Expense Tracking
- Add expenses with amount and description
- Select who paid
- Split equally among selected members
- View expense details with split breakdown
- Edit/delete expenses (creator or admin only)

### Balance Calculation
- Real-time balance calculation
- View who owes whom
- Simplified debt structure
- Color-coded balances (red=owing, green=owed)

### Settlement
- Record payments to settle debts
- Requires payee confirmation
- Optional notes for payment method
- Updates balances automatically

## Design System

### Colors
- Primary: #4F46E5 (Indigo)
- Secondary: #10B981 (Green)
- Error: #EF4444 (Red)
- Warning: #F59E0B (Amber)
- Background: #FFFFFF
- Surface: #F9FAFB

### Typography
- Heading1: 28px, Bold
- Heading2: 24px, SemiBold
- Heading3: 20px, SemiBold
- Body: 16px, Regular
- Caption: 14px, Regular

### Spacing
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

## Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Email validation works
- [ ] OTP is sent successfully
- [ ] OTP verification works
- [ ] Invalid OTP shows error
- [ ] Logout clears token

**Groups:**
- [ ] Can create new group
- [ ] Can view groups list
- [ ] Can view group details
- [ ] Can add members
- [ ] Can remove members (admin only)

**Expenses:**
- [ ] Can add expense
- [ ] Amount formatting works
- [ ] Split selection works
- [ ] Can view expense details
- [ ] Expenses appear in group

**Balances:**
- [ ] Balances calculate correctly
- [ ] Can view all balances
- [ ] Can settle up
- [ ] Settlement updates balances

**Profile:**
- [ ] Can view profile
- [ ] Can edit name
- [ ] Can logout

## Common Issues & Solutions

### Issue: "Network Error"
**Solution:** Ensure backend API is running on http://localhost:3000

### Issue: "Unable to resolve module"
**Solution:** Clear cache and reinstall:
```bash
rm -rf node_modules
npm install
npx expo start -c
```

### Issue: "Token not found"
**Solution:** Logout and login again to refresh token

### Issue: TypeScript errors
**Solution:** Run TypeScript check:
```bash
npx tsc --noEmit
```

## API Integration

The app communicates with the backend API using REST endpoints. All API calls are authenticated using JWT tokens stored in Expo Secure Store.

### Request Flow:
1. User action triggers React Query mutation/query
2. Hook calls API service function
3. Axios interceptor adds JWT token to headers
4. Request sent to backend
5. Response handled by React Query
6. Cache updated automatically
7. UI re-renders with new data

### Error Handling:
- Network errors show user-friendly messages
- Validation errors display inline
- Token expiry triggers logout
- Rate limiting shows retry option

## State Management

- **React Query:** Server state (API data)
- **React State:** Component-local UI state
- **Secure Store:** JWT token persistence
- **Navigation State:** React Navigation

## Performance Optimizations

- React Query caching (5-minute stale time)
- Optimistic updates for mutations
- Pagination for large lists
- Pull-to-refresh on list screens
- Debounced search inputs
- Minimal re-renders with React.memo

## Security

- JWT tokens stored in Expo Secure Store
- HTTPS recommended for production
- Token sent in Authorization header
- No sensitive data in AsyncStorage
- Input validation on all forms
- API rate limiting respected

## Future Enhancements

- Offline support with queue sync
- Push notifications for settlements
- Receipt photo upload
- Export expenses to CSV
- Multiple currency support
- Dark mode theme
- Biometric authentication
- Split by percentage/shares

## Contributing

1. Follow existing code structure
2. Use TypeScript strict mode
3. Follow component naming conventions
4. Add proper error handling
5. Test on both iOS and Android
6. Update this README for major changes

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- Check MOBILE_SCREENS.md for UI specifications
- Check API_CONTRACT.md for API documentation
- Review existing code for patterns
- Contact the development team

---

**Built with ❤️ using React Native + Expo**
