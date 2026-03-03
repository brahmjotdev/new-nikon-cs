# 🔐 Full Auth + Authorization Master Checklist

Stack: Next.js (App Router) + Convex + Better Auth
Architecture: Multi-role public app (user + admin)

I am:

* A normal user of the app
* Also an admin (role: "admin")

Admin is NOT separate from users.
Admin = user with elevated permissions.

Roles:

- admin is agent also
- agent (i.e user)

For this project:

- Use the **admin** account only for admin tasks and admin routes (e.g. `app/admin/*`).
- Use the **agent** account only for agent tasks and protected routes (e.g. `app/(protected)/*`).
- Admin role must not be used to browse agent-only pages; keep admin and agent UIs clearly separated.

---

## Execution order (phases)

- **Phase 0** — Project structure (baseline)
- **Phase 1** — Core Better Auth + Admin plugin + Convex auth + Backend security rules
- **Phase 2** — Auth helpers, Next.js middleware, Hooks, Route protection (layouts)
- **Phase 3** — Email system, Password reset flows, Password expiry, Rate limiting (still email/password for testing)
- **Phase 4** — Switch to username-only login for both agent and admin (email only for admin reset)
- **Phase 5** — Final sanity check

---

# 📁 PROJECT STRUCTURE OVERVIEW (Phase 0)

## Backend — Convex

* [x] `convex/` → main backend
* [x] `convex/betterAuth/` → Better Auth core layer
* [x] `convex/emails/` → email templates
* [x] `convex/functions/` → queries, mutations, actions

Core config files:

* [x] `convex/auth.config.ts` → Better Auth config
* [x] `convex/convex.config.ts` → Convex config
* [x] `convex/http.ts` → HTTP endpoints (auth routes; rate limiting in Next.js route)

---

# 🔐 BETTER AUTH LAYER (Phase 1)

* [x] `convex/betterAuth/adapter.ts` → Better Auth adapter

  * Connects Better Auth to Convex DB
  * Handles CRUD between auth + database

* [x] `convex/betterAuth/auth.ts`

  * Better Auth server setup
  * Plugins configured

* [x] `convex/betterAuth/convex.config.ts`

  * Better Auth + Convex config wrapper

* [x] `convex/betterAuth/schema.ts`

  * Auth-related tables
  * Indexes added for performance

---

# 🔌 ADMIN PLUGIN CONFIGURATION (Phase 1)

## Admin Plugin

* [x] Added admin plugin schemas to `betterAuth/schema.ts`
* [x] Added admin plugin to server auth config
* [x] Added admin plugin to client auth config
* [x] Default role set to "agent"

Next:

* [ ] Verify role assignment works correctly
* [ ] Ensure role cannot be changed from frontend

---

# 👤 USER AUTHORIZATION LAYER — Convex (Phase 1)

File: `convex/functions/auth.ts`

* [x] getCurrentUser

* [x] requireUser

  * Must:

    * [x] Check identity exists
    * [x] Check banned === false
    * [x] Check approved === true
    * [x] Enforce password expiry

* [x] requireAdmin

  * Must:

    * [x] Call requireUser
    * [x] Check role === "admin"

---

# 🔐 BACKEND SECURITY RULE (Phase 1)

* [x] Every Convex function depending on user must call requireUser
* [x] Every admin function must call requireAdmin
* [x] Never trust frontend

---

# 📧 EMAIL SYSTEM (Phase 3)

These templates support the password reset flows below. Admin-only email reset.

* [x] `convex/emails/component/email-base.tsx`
* [x] `convex/emails/reset-password.tsx`

Ensure:

* [x] Only admin receives email reset
* [x] Agents never use email reset

---

# 🌐 NEXT.JS LAYER (Phase 2)

## Middleware

File: `src/proxy.ts`

* [x] Map token in middleware
* [x] Only check authentication (not roles)
* [x] Redirect unauthenticated users to /login
* [x] DO NOT perform role checks here

---

# 📦 AUTH HELPERS (Phase 2)

* [x] `src/lib/auth-server.ts`
* [x] `src/lib/auth-client.ts`

Ensure:

* [x] Server exports getToken + fetchAuthQuery
* [x] Client configured with plugins

---

# 🪝 HOOKS LAYER (Phase 2)

File: `src/hooks/db/use-auth.ts`

## Agent (User)

* [x] registerUser
* [x] loginUser
* [x] getAuthenticatedUser
* [x] logoutUser
* [x] updateUser

## Admin

* [x] listUsers (useAdminUsers)
* [x] getUserById (useAdminUserById)
* [x] createUser (useAdminAuth)
* [x] setUserRole (useAdminAuth)
* [x] setUserPassword (Phase 3 or custom)
* [ ] updateUser admin (Phase 3; self-update via useAuth.updateUser)
* [x] approveUser (useApproveUser / useAdminAuth)
* [ ] listUserSessions (Better Auth; add when needed)
* [ ] listAllUserSessions (Better Auth; add when needed)
* [x] revokeUserSession / revokeAllUserSessions (useAdminAuth.revokeUserSessions)
* [ ] deleteUser (useAdminAuth) — not exposed by Better Auth admin plugin; add Convex mutation if needed (Phase 3)

Important:

* [x] Hooks must NOT contain security logic
* [x] Security must be enforced in Convex backend

---

# 🛡 ROUTE PROTECTION RULES (Phase 2)

## Layout-Level Protection (Primary Security UX Wall)

* [x] Secure `app/(protected)/layout.tsx`

  * [x] fetch current user
  * [x] redirect if not authenticated
  * [x] redirect if not approved
  * [x] redirect if role !== "agent"
  * [x] remember only agents can access `app/(protected)/layout.tsx` (admin uses admin area)

* [x] Secure `app/admin/layout.tsx`

  * [x] fetch current user
  * [x] redirect if role !== "admin"
  * [x] remember only admin can access `app/admin/layout.tsx`

Rules:

* [x] Role-based redirects handled ONLY at layout level
* [x] Middleware handles only authentication

Test Cases:

* [ ] User trying to access admin layout → blocked
* [ ] Admin trying to access protected agent layout → blocked (admin must use admin area)

---

# 🔑 USERNAME LOGIN CONFIGURATION (Phase 4)

**Before this section:** Test auth fully with **email + password** for both agents and admin. All flows and protections (Convex, layouts, middleware) should be verified with email-based login.

**After this section:** Login is **username + password only** for both roles. Company requirement: agents must not use email for login; only username. Admin also logs in with username but must have email on file so they can reset password for themselves and for agents (reset link is sent to email).

* [ ] Add username plugin schema
* [ ] Add username plugin to server config
* [ ] Add username plugin to client config
* [ ] Disable email login for agents

Admin:

* [ ] Admin logs in with username/password (not email)
* [ ] Admin must provide email (for reset only — self and agents)
* [ ] Admin cannot access `/forgot-password` (use admin reset route)

---

# 🔁 PASSWORD RESET FLOWS (Phase 3)

## Agent Reset Flow

* [x] `/forgot-password` page (username only — agents never use email for reset)
* [x] Notify admin (agent submits username; admin sees reset requests)
* [x] Admin resets password (admin sets new password for agent via admin UI)
* [x] Admin sends new password via secure DM (admin communicates to agent out-of-band)
* [x] Admin cannot access `/forgot-password`

## Admin Reset Flow

* [x] `/admin-forgot-password`
* [x] Admin enters email (reset link sent to that email)
* [x] Email reset link sent
* [x] Agents cannot access this page

---

# 🔄 PASSWORD EXPIRY SYSTEM (Phase 3)

## Schema Updates

* [x] Add `passwordExpiresAt`
* [x] Add `passwordChangedAt`

## Banner Logic

* [x] Show banner 1 day before expiry
* [x] Remove banner after update

## Forced Expiry

* [x] On login, check expiry
* [x] If expired → redirect to `/update-password`
* [x] Block access until updated

## Update Flow

* [x] `/update-password` page
* [x] Require current password + new password
* [x] Update expiry fields
* [x] Redirect to `/products`

---

# 🚦 RATE LIMITING (Phase 3)

Apply rate limiting to:

* [x] login
* [x] register
* [x] forgot-password

Implement in:

* [x] Next.js route OR
* [ ] Convex HTTP action
Rate limiting implemented in Next.js route; Convex HTTP used for auth routes only.

---

# 🧠 FINAL SANITY CHECK (Phase 5)

* [ ] Admin is just a user with elevated role
* [ ] No public role escalation
* [ ] No security logic in frontend
* [ ] Middleware does not handle roles — only authentication (i.e. check if user is authenticated)
* [ ] Password expiry enforced server-side

---

# ✅ TASK LIST — What will be done

**Phase 1 — Core auth with email/password**

- Set up Better Auth core in `convex/betterAuth/*` with email+password login for both roles
- Configure admin plugin and roles (`agent`, `admin`) with default role `agent`
- Implement Convex auth helpers in `convex/functions/auth.ts` (`getCurrentUser`, `requireUser`, `requireAdmin`, `getUsersList`) using email-based identity
- Enforce backend security rules: every user/admin Convex function calls `requireUser` or `requireAdmin`

**Phase 2 — Next.js integration and route protection**

- Implement server/client auth helpers in `src/lib/auth-server.ts` and `src/lib/auth-client.ts`
- Configure Next.js proxy/middleware in `src/proxy.ts` for authentication only (no role checks)
- Implement `use-auth` hooks in `src/hooks/db/use-auth.ts` wrapping backend auth (no security logic in hooks)
- Protect layouts: `app/(protected)/layout.tsx` and `app/admin/layout.tsx` using current user and roles

**Phase 3 — Password reset, expiry, and rate limiting (still email/password)**

- Implement email templates in `convex/emails/*` for admin password reset flows
- Build agent and admin password reset flows (`/forgot-password` username-only; `/admin-forgot-password` with admin email)
- Implement password expiry fields and logic (banner, forced update flow, `/update-password`)
- Add rate limiting to login, register, and forgot-password endpoints

**Phase 4 — Switch to username-only login**

- Add username plugin schema and config to Better Auth (server + client)
- Migrate login so both agents and admin use **username+password** only
- Ensure agents cannot log in with email; admin keeps email only for password reset (self and agents)
- Update tests/checklist to reflect username-only as final state

**Phase 5 — Final verification**

- Verify admin is just a user with elevated role; no public role escalation
- Confirm no security logic in frontend; everything enforced in Convex
- Confirm middleware handles only authentication, not roles
- Confirm password expiry and reset flows work under username-only login
