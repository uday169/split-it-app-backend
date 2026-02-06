# Future Enhancements

This document outlines features and improvements that are **intentionally out of scope** for the MVP but would add value in future iterations.

---

## Phase 1: User Experience Enhancements

### 1.1 Profile Pictures

**Feature**: Upload and display profile photos

**Technical Requirements**:
- Firebase Storage for image hosting
- Image picker in mobile app
- Image compression/resizing
- Avatar fallback to initials

**Estimated Effort**: 8 hours

**Value**: More personal, easier to identify users

---

### 1.2 Dark Mode

**Feature**: System-wide dark theme

**Technical Requirements**:
- Dark color palette definition
- Theme context provider
- Respect system preference
- Toggle in settings

**Estimated Effort**: 12 hours

**Value**: Better UX in low-light, modern expectation

---

### 1.3 Expense Categories

**Feature**: Categorize expenses (Food, Travel, Utilities, etc.)

**Technical Requirements**:
- Add `category` field to expense schema
- Predefined categories with icons
- Filter expenses by category
- Category-wise spending summary

**Estimated Effort**: 10 hours

**Value**: Better expense tracking and insights

---

### 1.4 Expense Photos

**Feature**: Attach receipt photos to expenses

**Technical Requirements**:
- Firebase Storage integration
- Image picker/camera access
- Thumbnail generation
- Photo viewer

**Estimated Effort**: 12 hours

**Value**: Better expense verification and record-keeping

---

### 1.5 Expense Comments

**Feature**: Add comments/notes to expenses

**Technical Requirements**:
- New `expenseComments` collection
- Comment thread UI
- Real-time updates (Firestore listeners)
- Notifications for new comments

**Estimated Effort**: 15 hours

**Value**: Better communication about expenses

---

## Phase 2: Split Logic Enhancements

### 2.1 Percentage-Based Splits

**Feature**: Split by percentage instead of equal amounts

**Example**: 
- Person A: 60% ($48)
- Person B: 40% ($32)
- Total: $80

**Technical Requirements**:
- Add `splitType: 'percentage'` option
- Percentage input UI
- Validation (must sum to 100%)

**Estimated Effort**: 6 hours

**Value**: More flexible split options

---

### 2.2 Shares-Based Splits

**Feature**: Split by shares (e.g., person ordered 2 drinks)

**Example**:
- Person A: 2 shares
- Person B: 1 share
- Total: 3 shares → A pays 2/3, B pays 1/3

**Technical Requirements**:
- Add `splitType: 'shares'` option
- Shares input UI
- Calculate individual amounts from shares

**Estimated Effort**: 6 hours

**Value**: Useful for itemized bills

---

### 2.3 Itemized Split

**Feature**: Split by individual items

**Example**:
- Pizza $20 → shared by A, B
- Beer $10 → only A
- A pays: $20 (10 pizza + 10 beer)
- B pays: $10 (10 pizza)

**Technical Requirements**:
- New `expenseItems` sub-collection
- Item entry UI
- Assign items to people
- Calculate from items

**Estimated Effort**: 20 hours

**Value**: Most accurate splitting for restaurant bills

---

### 2.4 Recurring Expenses

**Feature**: Set up recurring expenses (e.g., monthly rent)

**Technical Requirements**:
- Add `recurring` field to expense
- Recurrence pattern (daily, weekly, monthly)
- Background job to create expenses
- Edit/cancel recurrence

**Estimated Effort**: 25 hours

**Value**: Convenient for regular shared expenses

---

## Phase 3: Settlement Improvements

### 3.1 Smart Debt Simplification

**Feature**: Simplify complex debts across multiple people

**Example**:
- Before: A owes B $20, B owes C $20
- After: A owes C $20 (B eliminated)

**Technical Requirements**:
- Graph-based debt simplification algorithm
- Show "Simplified" vs "Detailed" view
- Explain simplification to users

**Estimated Effort**: 15 hours

**Value**: Fewer transactions needed

---

### 3.2 Payment Integration

**Feature**: Pay directly through app (Stripe, Venmo, etc.)

**Technical Requirements**:
- Stripe/PayPal SDK integration
- Payment flow in app
- Auto-confirm settlement on payment
- Handle payment failures
- Compliance (PCI, KYC)

**Estimated Effort**: 40 hours + compliance work

**Value**: Frictionless payments

**Risks**: Regulatory complexity, fees

---

### 3.3 Settlement Reminders

**Feature**: Automated reminders for unsettled debts

**Technical Requirements**:
- Background job to check balances
- Email reminders (weekly/monthly)
- User preference for reminder frequency
- "Mark as reminded" to avoid spam

**Estimated Effort**: 10 hours

**Value**: Helps ensure debts are settled

---

## Phase 4: Multi-Currency & Localization

### 4.1 Multi-Currency Support

**Feature**: Handle expenses in different currencies

**Technical Requirements**:
- Store currency with each expense
- Currency conversion API (e.g., exchangerate-api.io)
- Display in user's preferred currency
- Handle exchange rate changes over time

**Estimated Effort**: 20 hours

**Value**: Essential for international groups

---

### 4.2 Localization (i18n)

**Feature**: Support multiple languages

**Technical Requirements**:
- i18next or react-i18next
- Translation files (JSON)
- Date/number formatting per locale
- RTL support for Arabic/Hebrew

**Languages Priority**:
1. English (default)
2. Spanish
3. French
4. German
5. Hindi

**Estimated Effort**: 30 hours + translation costs

**Value**: Wider user base

---

## Phase 5: Social Features

### 5.1 Friend Network

**Feature**: Add friends, see their groups

**Technical Requirements**:
- New `friends` or `friendRequests` collection
- Add friend flow
- Friend list UI
- Quick-add friends to groups

**Estimated Effort**: 15 hours

**Value**: Easier group creation

---

### 5.2 Public Group Templates

**Feature**: Create and share group templates

**Example**: "Weekend Trip Template" with typical expense categories

**Technical Requirements**:
- Template creation UI
- Template marketplace
- Apply template to new group

**Estimated Effort**: 25 hours

**Value**: Faster group setup

---

### 5.3 Activity Feed

**Feature**: See friend activity (public opt-in)

**Example**: "John created a new group 'Beach Trip'"

**Technical Requirements**:
- Privacy settings
- Activity feed collection
- Real-time updates
- Like/comment on activities

**Estimated Effort**: 20 hours

**Value**: Social engagement

---

## Phase 6: Analytics & Insights

### 6.1 Spending Insights

**Feature**: Visualize spending patterns

**Charts**:
- Spending by category (pie chart)
- Spending over time (line chart)
- Top spenders (bar chart)
- Average expense amount

**Technical Requirements**:
- Data aggregation logic
- Chart library (react-native-chart-kit)
- Date range filters
- Export to PDF

**Estimated Effort**: 20 hours

**Value**: Better financial awareness

---

### 6.2 Export to CSV/Excel

**Feature**: Export expenses and balances

**Formats**:
- CSV
- Excel (XLSX)
- PDF

**Technical Requirements**:
- Export button in group settings
- Generate file server-side or client-side
- Email file or direct download

**Estimated Effort**: 10 hours

**Value**: Record-keeping, tax purposes

---

### 6.3 Budget Limits

**Feature**: Set budget limits for groups

**Example**: "Keep trip under $500 per person"

**Technical Requirements**:
- Budget field on group
- Progress bar in UI
- Alert when approaching/exceeding

**Estimated Effort**: 8 hours

**Value**: Spending control

---

## Phase 7: Advanced Notifications

### 7.1 Push Notifications

**Feature**: Real-time mobile push notifications

**Events**:
- Expense added
- Settlement recorded/confirmed
- Added to group
- Payment reminder

**Technical Requirements**:
- Firebase Cloud Messaging (FCM)
- Device token storage
- Notification preferences per user
- Background notification handling

**Estimated Effort**: 15 hours

**Value**: Better engagement, faster responses

---

### 7.2 In-App Notifications

**Feature**: Notification center in app

**Technical Requirements**:
- New `notifications` collection
- Badge count on tab icon
- Notification list screen
- Mark as read/unread

**Estimated Effort**: 12 hours

**Value**: Centralized updates

---

### 7.3 Custom Notification Preferences

**Feature**: Fine-grained notification settings

**Options**:
- Email: All / Daily digest / None
- Push: All / Important only / None
- Per-group settings
- Quiet hours

**Technical Requirements**:
- Notification settings UI
- Backend logic to respect preferences
- Schedule digest emails

**Estimated Effort**: 10 hours

**Value**: Reduce notification fatigue

---

## Phase 8: Performance & Scalability

### 8.1 Redis Caching

**Feature**: Cache balance calculations

**Technical Requirements**:
- Redis instance (Railway addon)
- Cache balance calculations
- Invalidate on expense/settlement changes
- TTL of 5 minutes

**Estimated Effort**: 12 hours

**Value**: Faster API responses

---

### 8.2 Background Jobs

**Feature**: Queue for email sending and heavy operations

**Technical Requirements**:
- Bull queue library
- Redis for queue storage
- Separate worker process
- Retry logic

**Estimated Effort**: 15 hours

**Value**: Non-blocking API requests

---

### 8.3 Database Optimization

**Feature**: Advanced Firestore indexes and query optimization

**Tasks**:
- Composite indexes for all queries
- Pagination everywhere
- Limit returned fields (select)
- Batch reads where possible

**Estimated Effort**: 8 hours

**Value**: Reduced costs, faster queries

---

### 8.4 Mobile App Performance

**Feature**: Optimize mobile app performance

**Tasks**:
- Code splitting (lazy loading screens)
- Image optimization
- Reduce bundle size
- FlatList optimization (windowSize, getItemLayout)
- React.memo for expensive components

**Estimated Effort**: 12 hours

**Value**: Faster app, better UX

---

## Phase 9: Security & Compliance

### 9.1 Two-Factor Authentication (2FA)

**Feature**: Optional 2FA for login

**Methods**:
- Authenticator app (TOTP)
- SMS backup

**Technical Requirements**:
- TOTP library (speakeasy)
- QR code generation
- Backup codes

**Estimated Effort**: 20 hours

**Value**: Enhanced security

---

### 9.2 Audit Logs

**Feature**: Log all important actions

**Logged Events**:
- Expense created/edited/deleted
- Member added/removed
- Settlement recorded/confirmed
- Group settings changed

**Technical Requirements**:
- New `auditLogs` collection
- Auto-log in service layer
- Audit log viewer (admin only)

**Estimated Effort**: 10 hours

**Value**: Transparency, debugging

---

### 9.3 Data Privacy Features

**Feature**: GDPR/CCPA compliance

**Features**:
- Export user data (JSON)
- Delete account + all data
- Privacy policy acceptance
- Data retention policy (auto-delete old OTPs)

**Estimated Effort**: 15 hours

**Value**: Legal compliance, trust

---

## Phase 10: Admin & Operations

### 10.1 Admin Dashboard (Web)

**Feature**: Web dashboard for support/admin

**Features**:
- User search
- Group overview
- Metrics (total users, groups, expenses)
- Support tools (reset OTP, view logs)

**Technical Requirements**:
- Separate Next.js web app
- Admin authentication
- Read-only Firebase access
- Charts and tables

**Estimated Effort**: 40 hours

**Value**: Better operations, support

---

### 10.2 Error Tracking

**Feature**: Automated error monitoring

**Tool**: Sentry

**Setup**:
- Sentry SDK in backend
- Sentry SDK in mobile app
- Alerts for critical errors
- Performance monitoring

**Estimated Effort**: 5 hours

**Value**: Proactive bug fixing

---

### 10.3 APM (Application Performance Monitoring)

**Feature**: Monitor backend performance

**Tool**: New Relic / Datadog

**Metrics**:
- API response times
- Database query times
- Error rates
- Throughput

**Estimated Effort**: 8 hours

**Value**: Performance insights

---

## Phase 11: Alternative Platforms

### 11.1 Web App

**Feature**: Progressive Web App (PWA) version

**Technical Requirements**:
- Next.js or React SPA
- Responsive design
- Offline support (Service Worker)
- Share same backend API

**Estimated Effort**: 80 hours

**Value**: Desktop users, broader reach

---

### 11.2 iOS TestFlight Release

**Feature**: Publish to Apple TestFlight

**Requirements**:
- Apple Developer account ($99/year)
- iOS build configuration
- App Store Connect setup
- EAS Build for iOS

**Estimated Effort**: 10 hours

**Value**: iOS user testing

---

## Phase 12: Business Features (SaaS)

### 12.1 Multi-Tenant SaaS

**Feature**: White-label for organizations

**Use Cases**:
- Companies (team expenses)
- Universities (club expenses)
- Communities

**Technical Requirements**:
- Tenant model in database
- Subdomain routing (tenant.splitit.app)
- Custom branding per tenant
- Admin per tenant

**Estimated Effort**: 60 hours

**Value**: B2B revenue stream

---

### 12.2 Premium Plans

**Feature**: Freemium model

**Free Tier**:
- 3 groups
- 20 expenses per month
- Basic features

**Premium Tier** ($4.99/month):
- Unlimited groups
- Unlimited expenses
- Advanced splits
- Export to CSV
- Priority support

**Technical Requirements**:
- Subscription management (Stripe Billing)
- Usage tracking
- Paywall UI
- Backend tier checks

**Estimated Effort**: 30 hours

**Value**: Monetization

---

## Phase 13: Integrations

### 13.1 Calendar Integration

**Feature**: Add expenses to calendar

**Use Cases**:
- View expense dates in calendar
- Sync settlement due dates

**Technical Requirements**:
- Google Calendar API
- Apple Calendar export
- iCal format generation

**Estimated Effort**: 12 hours

**Value**: Better planning

---

### 13.2 Bank Account Integration (Plaid)

**Feature**: Auto-import expenses from bank

**Technical Requirements**:
- Plaid SDK
- Transaction categorization
- Match transactions to expenses
- Security considerations

**Estimated Effort**: 40 hours

**Value**: Automatic expense tracking

**Risks**: Security, cost, complexity

---

### 13.3 Slack/Discord Bots

**Feature**: Expense notifications in Slack/Discord

**Commands**:
- `/split add-expense`
- `/split balances`
- `/split settle`

**Technical Requirements**:
- Bot development
- Slash commands
- OAuth for group linking

**Estimated Effort**: 25 hours

**Value**: Integration with team chat

---

## Non-Functional Improvements

### Automated Testing
- E2E tests with Detox (mobile)
- E2E tests with Cypress (web)
- Increase test coverage to 90%+

**Estimated Effort**: 30 hours

---

### CI/CD Pipeline
- GitHub Actions for tests
- Automated EAS builds
- Automated backend deployment
- Pre-release testing environment

**Estimated Effort**: 15 hours

---

### Documentation
- Interactive API docs (Swagger/OpenAPI)
- Video tutorials
- FAQ section
- Developer API guide (if opening API)

**Estimated Effort**: 20 hours

---

## Prioritization Matrix

| Feature | Value | Effort | Priority |
|---------|-------|--------|----------|
| Push Notifications | High | Medium | **High** |
| Multi-Currency | High | Medium | **High** |
| Dark Mode | Medium | Low | **High** |
| Expense Categories | Medium | Low | **Medium** |
| Smart Debt Simplification | High | Medium | **Medium** |
| Recurring Expenses | High | High | **Medium** |
| Payment Integration | Very High | Very High | **Low** (risky) |
| Profile Pictures | Low | Low | **Low** |
| Admin Dashboard | Medium | High | **Low** (not user-facing) |

---

## Estimated Total Effort for All Enhancements

**Total**: ~850 hours (~5-6 months of development)

**Recommendation**: Prioritize based on user feedback after MVP launch.

---

## Sunset Features (Never Build)

Features intentionally excluded:

- ❌ Social login (Google, Facebook) → Email-only by design
- ❌ Cryptocurrency payments → Too volatile, niche
- ❌ Ads → Degrades UX, better to charge premium
- ❌ Gamification (badges, points) → Unnecessary complexity

---

## Conclusion

This roadmap provides **13 phases** of enhancements post-MVP. The priority should be:

1. **User feedback** from MVP
2. **Fix critical bugs** first
3. **Add high-value, low-effort** features
4. **Iterate** based on usage data

The MVP is **production-ready** without any of these enhancements. Add features incrementally based on real user needs, not assumptions.
