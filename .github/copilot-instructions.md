# HealthPal - Copilot Instructions

## Project Overview
HealthPal is a Node.js/Express healthcare platform providing medical case management, consultations, donations, surgical missions, medicine supply coordination, and patient support services. It uses MySQL for persistence and JWT for authentication.

**Stack**: Express.js (ES modules), MySQL2, JWT, Bcrypt, Winston logging

## Architecture

### Core Pattern: MVC with Service Layer
- **Routes** (`src/routes/*.routes.js`): Define endpoints and mount controllers
- **Controllers** (`src/controllers/*.controller.js`): HTTP request handling and response formatting
- **Models** (`src/models/*.js`): Promise-based MySQL query wrappers with callback-to-Promise conversion
- **Services** (`src/service/`): External API integrations (Email, PDFs, Health/Trauma wikis)

### Data Access Pattern
Models wrap MySQL callbacks in Promises. Example from `User.js`:
```javascript
findByEmail(email) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
}
```
**Always use this pattern** when adding model methods—wrap db.query callbacks in Promises for async/await usage.

### Authentication & Authorization
- **JWT Token Structure**: `{ id, role, email }` (7-day expiry)
- **Middleware**: `src/middleware/auth.js` provides:
  - `auth`: Verifies Bearer token, sets `req.user`
  - `allowRoles(...roles)`: Role-based access control chain
- **Usage**: `router.post('/admin', auth, allowRoles('admin'), controllerFn)`
- **Roles**: Inferred from codebase: `patient`, `doctor`, `admin`, `ngo`

### API Response Convention
Controllers follow a consistent JSON response pattern:
```javascript
res.status(200).json({ message: "Success", data: results });
res.status(400).json({ message: "Invalid request" });
res.status(500).json({ message: "Internal server error" });
```
Error responses typically use `console.error()` + generic 500 message.

## Key Features & Domain Models

### Medical Cases
- **Files**: `MedicalCase.js`, `medicalcase.controller.js`, `cases.routes.js`
- **Related**: Case expenses, updates, feedback, transparency dashboard, invoices
- **Nested Routes**: `/cases/:caseId/expenses`, `/cases/:caseId/transparency`, `/cases/:caseId/invoice`

### User Roles & Personas
- **Patients**: Medical history, appointments, medical requests
- **Doctors**: Availability slots, consultations, surgical missions
- **NGOs**: Case management, inventory, donations
- **Anonymous Users**: Anonymous chat (no auth required)

### Consultation & Communication
- **Consultations**: Doctor-patient consultations with messages
- **Messages**: General messaging system
- **Anonymous Chat**: No-auth chat for sensitive discussions

### Financial & Supply Chain
- **Donations**: Monetary contributions to cases
- **Medicine Supply**: Inventory coordination
- **Medical Requests**: Patient requests for supplies
- **Med Match**: Matching patients with available resources

### Specialized Services
- **Surgical Missions**: Registrations and management
- **Trauma Support**: Integration with trauma wiki API
- **Support Groups**: Community peer support
- **Health Guides**: Integration with health wiki API

## Critical Setup & Dependencies

### Environment Variables (`.env`)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=healthpal
JWT_SECRET=your-secret-key
```

### Scripts
```bash
npm start     # Production: node server.js
npm run dev   # Development: nodemon server.js (auto-reload)
```

### External Dependencies
- **bcryptjs**: Password hashing (also bcrypt v5.1 installed—prefer bcryptjs)
- **jsonwebtoken**: JWT auth (process.env.JWT_SECRET required)
- **mysql2**: Connection pooling for queries
- **winston**: Structured logging via `src/utils/logger.js`
- **dotenv**: Environment configuration

## Developer Workflow

### Adding a New Feature
1. **Define Route**: Create `src/routes/feature.routes.js` with Express Router
2. **Create Controller**: Add `src/controllers/feature.controller.js` with exported async functions
3. **Add Model**: Create `src/models/Feature.js` with Promise-wrapped db methods
4. **Mount Route**: Import and `app.use('/feature', featureRoutes)` in `src/app.js`
5. **Apply Auth** (if needed): Chain `auth` and `allowRoles()` middleware in route handlers

### Testing Endpoints
Use REST client tools (Postman, VS Code REST Client). All endpoints expect:
- **Content-Type**: `application/json`
- **Auth Header** (protected routes): `Authorization: Bearer <token>`

## Code Patterns & Conventions

### Naming
- **Routes**: `src/routes/feature.routes.js` (plural + `.routes` suffix)
- **Controllers**: `src/controllers/feature.controller.js` (feature-specific)
- **Models**: `src/models/Feature.js` (capitalized, singular)
- **Exception**: `Profile.js` route file lacks `.routes` suffix—inconsistency to fix

### Error Handling
- Controllers wrap logic in try-catch blocks
- Reject Promises in models on error; controllers catch and return appropriate HTTP status
- Use `console.error()` for debugging (consider migrating to Winston logger)

### Database Queries
- Always use parameterized queries to prevent SQL injection: `db.query(sql, [params], callback)`
- Use LIMIT 1 for single-record lookups
- Models return single objects (e.g., `resolve(results[0])`) or arrays (e.g., `resolve(results)`)

## Cross-Component Communication

### Route Nesting
Some routes mount child routes (subrouters). Example:
```javascript
// In cases.routes.js
router.use("/:caseId/expenses", caseExpenseRoutes);
// Resolves: /cases/:caseId/expenses
```

### Service Integration
External services in `src/service/`:
- **EmailSender.js**: Transactional emails
- **HTML2PDF.js**: Invoice generation
- **HealthWikiAPI.js** / **TraumaWikiAPI.js**: Third-party knowledge bases

Access via direct import: `import EmailSender from "../service/EmailService/EmailSender.js"`

## What NOT to Do

- ❌ **Don't use callbacks directly** in new models—wrap in Promises
- ❌ **Don't hardcode secret values**—use `process.env`
- ❌ **Don't skip parameterized queries**—always use `?` placeholders
- ❌ **Don't mix auth patterns**—use provided middleware, don't create new auth logic
- ❌ **Don't log sensitive data** (passwords, tokens, full DB queries)

## Quick References

- **Main entry**: `server.js` → `src/app.js` (route setup)
- **Auth check**: `src/middleware/auth.js`
- **Database**: `src/config/db.js` (MySQL pool)
- **Logging**: `src/utils/logger.js`
- **Feature examples**: `Patient` (CRUD), `MedicalCase` (complex), `AnonymousChat` (public)
