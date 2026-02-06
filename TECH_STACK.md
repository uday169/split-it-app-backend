# Tech Stack Justification

## Decision Framework

All technology choices were made based on:
1. **Maturity & Stability**: Production-ready, well-maintained
2. **Developer Experience**: Good documentation, active community
3. **Performance**: Meets requirements without over-engineering
4. **Learning Curve**: Reasonable for mid-level developers
5. **Ecosystem**: Rich library support
6. **Cost**: Free tier available, scalable pricing

---

## Mobile App Stack

### React Native + Expo

**Version**: Expo SDK 50 (React Native 0.73)

**Why Chosen**:
- ✅ Cross-platform (iOS + Android from single codebase)
- ✅ Expo Go for rapid development and testing
- ✅ Over-the-air updates with EAS Update
- ✅ Managed workflow simplifies native dependencies
- ✅ Strong TypeScript support
- ✅ Large community and ecosystem

**Alternatives Considered**:
- ❌ Flutter: Team lacks Dart experience
- ❌ Native (Swift/Kotlin): 2x development time
- ❌ Ionic: Performance concerns, not as native-feeling

**Trade-offs**:
- Cannot use all native modules (acceptable for this scope)
- Larger bundle size than native apps (acceptable for WiFi-first use)

---

### TypeScript

**Version**: 5.3+

**Why Chosen**:
- ✅ Type safety reduces runtime errors
- ✅ Better IDE support (autocomplete, refactoring)
- ✅ Self-documenting code
- ✅ Industry standard for modern React projects
- ✅ Catches bugs at compile time

**Alternatives Considered**:
- ❌ JavaScript: Too error-prone for team project
- ❌ Flow: Less popular, smaller community

**Trade-offs**:
- Slight learning curve for team members new to TS
- Longer compile times (negligible with modern tools)

---

### React Navigation v7

**Why Chosen**:
- ✅ De facto standard for React Native navigation
- ✅ Type-safe routing with TypeScript
- ✅ Declarative API
- ✅ Built-in gestures and animations
- ✅ Deep linking support (future-ready)

**Alternatives Considered**:
- ❌ React Native Navigation: More native but complex setup
- ❌ Expo Router: Too new, less mature

---

### React Query (TanStack Query) v5

**Why Chosen**:
- ✅ Simplifies data fetching and caching
- ✅ Automatic background refetching
- ✅ Optimistic updates built-in
- ✅ Better DX than Redux for server state
- ✅ Reduces boilerplate significantly

**Alternatives Considered**:
- ❌ Redux Toolkit + RTK Query: More boilerplate, steeper learning curve
- ❌ SWR: Good, but React Query has better TypeScript support
- ❌ Apollo Client: Overkill for REST APIs

**Trade-offs**:
- Different mental model from Redux (but simpler)
- Team needs to understand server state vs client state

---

### Zod v3

**Why Chosen**:
- ✅ Runtime validation + TypeScript inference
- ✅ Same schemas on frontend and backend
- ✅ Excellent error messages
- ✅ Works seamlessly with React Hook Form

**Alternatives Considered**:
- ❌ Yup: Less TypeScript-friendly
- ❌ Joi: More verbose, less type inference
- ❌ io-ts: Too functional programming heavy

---

### React Hook Form v7

**Why Chosen**:
- ✅ Minimal re-renders (better performance)
- ✅ Easy integration with Zod
- ✅ Less boilerplate than Formik
- ✅ Built-in validation support

**Alternatives Considered**:
- ❌ Formik: More re-renders, slower
- ❌ Manual state: Too much boilerplate

---

### Expo Secure Store

**Why Chosen**:
- ✅ Secure storage for JWT tokens
- ✅ Uses iOS Keychain and Android Keystore
- ✅ Simple API
- ✅ Built into Expo

**Alternatives Considered**:
- ❌ AsyncStorage: Not encrypted
- ❌ react-native-keychain: Requires ejecting from Expo

---

## Backend Stack

### Node.js (LTS v20)

**Why Chosen**:
- ✅ JavaScript everywhere (shared code with mobile)
- ✅ Excellent async/await support for I/O operations
- ✅ Huge ecosystem (npm)
- ✅ Team already familiar with JavaScript
- ✅ Fast for I/O-bound operations (this app)

**Alternatives Considered**:
- ❌ Python + FastAPI: Team less familiar with Python
- ❌ Go: Overkill for this scale, team unfamiliar
- ❌ Java + Spring Boot: Too heavyweight, slower development

**Trade-offs**:
- Not as fast as Go for CPU-bound tasks (but we have few)
- Callback hell potential (mitigated by async/await)

---

### Express v4

**Why Chosen**:
- ✅ Most popular Node.js framework
- ✅ Minimalist, easy to understand
- ✅ Huge middleware ecosystem
- ✅ Flexible, not opinionated
- ✅ Team familiar with it

**Alternatives Considered**:
- ❌ Fastify: Slightly faster but less middleware
- ❌ NestJS: Too opinionated, steeper learning curve
- ❌ Koa: Smaller community, less middleware

**Trade-offs**:
- Not as opinionated (need to structure ourselves)
- Slightly slower than Fastify (negligible at our scale)

---

### Firebase Firestore

**Why Chosen**:
- ✅ Managed NoSQL database (no server maintenance)
- ✅ Real-time capabilities (future feature)
- ✅ Automatic scaling
- ✅ Generous free tier
- ✅ Firebase Admin SDK is excellent
- ✅ Easy to set up and iterate

**Alternatives Considered**:
- ❌ PostgreSQL: Need to manage server, slower iteration
- ❌ MongoDB Atlas: Similar but Firebase integration is better
- ❌ Supabase: Less mature than Firebase

**Trade-offs**:
- Limited query capabilities (no joins, limited filtering)
- Vendor lock-in (acceptable for this project)
- Pricing can scale quickly (mitigated by efficient queries)

**Schema Design Decision**:
- Flat structure (few subcollections) for simplicity
- Denormalization where needed (e.g., member count)
- Indexes for all common queries

---

### JWT (jsonwebtoken)

**Why Chosen**:
- ✅ Stateless authentication (backend can scale horizontally)
- ✅ Industry standard
- ✅ Works well with mobile apps
- ✅ Simple to implement

**Alternatives Considered**:
- ❌ Sessions: Requires session storage, harder to scale
- ❌ Firebase Auth on client: Requirement is backend-driven auth
- ❌ OAuth2: Overkill for this scope

**Trade-offs**:
- Cannot revoke tokens (acceptable: 30-day expiry)
- Token size larger than session ID (acceptable: ~200 bytes)

**Token Strategy**:
- Access token: 30-day expiry (no refresh token in MVP)
- Payload: `{ userId, email, iat, exp }`
- Future: Add refresh token pattern if needed

---

### Nodemailer

**Why Chosen**:
- ✅ Most popular Node.js email library
- ✅ Works with any SMTP provider
- ✅ Simple API
- ✅ Supports HTML emails

**SMTP Provider**: 
- Development: Mailtrap
- Production: SendGrid / AWS SES / Mailgun

**Alternatives Considered**:
- ❌ SendGrid SDK: Vendor lock-in
- ❌ AWS SES SDK: Vendor lock-in
- ❌ Mailgun SDK: Vendor lock-in

**Decision**: Use Nodemailer with SMTP so provider is swappable

---

### Zod v3 (Backend)

**Why Chosen**:
- ✅ Same as frontend (code reuse)
- ✅ Type inference for TypeScript
- ✅ Better error messages than class-validator

**Alternatives Considered**:
- ❌ class-validator: Requires decorators, less type inference
- ❌ Joi: Less TypeScript-friendly

---

### Winston (Logging)

**Why Chosen**:
- ✅ Industry standard Node.js logger
- ✅ Multiple transports (console, file, cloud)
- ✅ Log levels
- ✅ Structured logging (JSON)

**Alternatives Considered**:
- ❌ Bunyan: Less popular
- ❌ Pino: Faster but less features
- ❌ console.log: Not structured, can't filter

---

### Helmet (Security)

**Why Chosen**:
- ✅ Sets secure HTTP headers
- ✅ Industry best practice
- ✅ Easy to set up

**Headers Set**:
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

---

### express-rate-limit

**Why Chosen**:
- ✅ Simple rate limiting middleware
- ✅ Prevents OTP spam
- ✅ Configurable per route

**Configuration**:
- OTP endpoint: 3 requests per 15 minutes per email
- Other endpoints: 100 requests per 5 minutes per IP

---

### CORS

**Why Chosen**:
- ✅ Required for mobile app to call API
- ✅ Simple middleware

**Configuration**:
- Development: Allow all origins
- Production: Allow only mobile app origin

---

## Development & Testing Tools

### ESLint + Prettier

**Why Chosen**:
- ✅ Enforces code style consistency
- ✅ Catches common errors
- ✅ Auto-formatting saves time

**Config**:
- Airbnb style guide base
- TypeScript-specific rules
- React hooks rules

---

### Jest (Testing)

**Why Chosen**:
- ✅ De facto standard for JavaScript testing
- ✅ Built-in mocking
- ✅ Snapshot testing
- ✅ Works with TypeScript (ts-jest)

---

### Supertest (API Testing)

**Why Chosen**:
- ✅ Easy HTTP assertions
- ✅ Works with Express
- ✅ Integrates with Jest

---

### React Testing Library

**Why Chosen**:
- ✅ Tests components from user perspective
- ✅ Discourages testing implementation details
- ✅ React Native Testing Library available

---

### Firebase Emulator Suite

**Why Chosen**:
- ✅ Local Firestore for testing
- ✅ No need for test project
- ✅ Fast, isolated tests

---

## Deployment & DevOps

### Railway (Backend Hosting)

**Why Chosen**:
- ✅ Simple Git-based deployment
- ✅ Generous free tier
- ✅ Auto-scaling
- ✅ Environment variables management
- ✅ Logs and monitoring

**Alternatives**:
- Render: Similar, slightly slower
- Fly.io: Good but more complex
- Heroku: Expensive
- AWS EC2: Too much DevOps overhead

---

### EAS Build (Mobile Builds)

**Why Chosen**:
- ✅ Official Expo build service
- ✅ No need for Mac or Android Studio locally
- ✅ Generates APK/IPA in cloud

**Alternatives**:
- ❌ Local builds: Requires setup on every dev machine
- ❌ GitHub Actions: More complex setup

---

## What We're NOT Using (and Why)

### Redux

- React Query handles server state better
- Less boilerplate
- Easier to learn

### GraphQL

- REST is simpler for this scale
- Team more familiar with REST
- Less tooling complexity

### Microservices

- Monolith is simpler for MVP
- Easier to debug and develop
- Can split later if needed

### Docker

- Not needed for managed services (Firebase, Railway)
- Adds complexity for local development

### CI/CD Pipeline

- MVP doesn't need it yet
- Railway auto-deploys on push
- Can add GitHub Actions later

### Monitoring (Sentry, New Relic)

- Out of scope for MVP
- Can add later

### Push Notifications (FCM)

- Explicitly out of scope
- Email notifications sufficient for MVP

---

## Version Strategy

### Lock Dependencies

**Why**:
- Prevents "works on my machine" issues
- Reproducible builds

**How**:
- Use `package-lock.json` (commit it)
- Specify exact versions in package.json initially
- Update deliberately, not automatically

### Version Ranges

After MVP, use:
- Patch updates: `~1.2.3` (bug fixes only)
- Minor updates: `^1.2.3` (new features, non-breaking)

---

## Cost Analysis

| Service | Free Tier | Expected Monthly Cost |
|---------|-----------|----------------------|
| Firebase Firestore | 1 GB storage, 50K reads/day | $0 (within free tier) |
| Railway (Backend) | 500 hours/month | $0-5 (within free tier) |
| SendGrid (Email) | 100 emails/day | $0 (within free tier) |
| Expo EAS Build | 30 builds/month | $0 (within free tier) |
| **Total** | | **$0-5/month** |

---

## Upgrade Path (Future Enhancements)

When the app grows, consider:

1. **Add Redis**: For caching balance calculations
2. **Add Bull**: For background job processing (emails)
3. **Add Sentry**: For error tracking
4. **Add Firebase Cloud Functions**: For scheduled tasks
5. **Add Elasticsearch**: For advanced search
6. **Migrate to NestJS**: If team grows and needs more structure
7. **Add GraphQL**: If mobile app needs more flexible queries

---

## Summary

This tech stack is:
- ✅ **Modern**: Uses latest stable versions
- ✅ **Proven**: All technologies battle-tested in production
- ✅ **Maintainable**: Good documentation and community support
- ✅ **Scalable**: Can handle 10K+ users without changes
- ✅ **Cost-effective**: Free tier for MVP
- ✅ **Developer-friendly**: Good DX, fast iteration

The choices prioritize:
1. **Speed of development** (MVP in 4-5 weeks)
2. **Code quality** (TypeScript, testing)
3. **Simplicity** (avoid over-engineering)
4. **Team familiarity** (JavaScript/TypeScript everywhere)

This is a **pragmatic, interview-worthy** stack that balances modern best practices with project constraints.
