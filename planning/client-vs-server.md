# Using Better Auth with Convex

Better Auth is **not strictly opinionated** about using server actions vs client-side authentication[(1)](https://github.com/better-auth/better-auth/discussions/4927). However, **the recommendation is to use the client SDK (`authClient`) for authentication operations** rather than server actions with `auth.api`[(1)](https://github.com/better-auth/better-auth/discussions/4927).

## Client-Side Functions (Recommended)

Most authentication operations should be called from the **client side** using `authClient`:

**Authentication:**
- `signIn.email()` - Sign in with email/password[(2)](https://www.better-auth.com/docs/authentication/email-password)
- `signUpEmail()` - Register new user[(2)](https://www.better-auth.com/docs/authentication/email-password)
- `signOut()` - Sign out user[(2)](https://www.better-auth.com/docs/authentication/email-password)

**User Management:**
- `updateUser()` - Update user information[(3)](https://www.better-auth.com/docs/concepts/users-accounts)
- `changeEmail()` - Change user email[(3)](https://www.better-auth.com/docs/concepts/users-accounts)
- `changePassword()` - Change user password[(2)](https://www.better-auth.com/docs/authentication/email-password)[(3)](https://www.better-auth.com/docs/concepts/users-accounts)
- `deleteUser()` - Delete user account[(3)](https://www.better-auth.com/docs/concepts/users-accounts)

**Password Reset:**
- `requestPasswordReset()` - Request password reset email[(2)](https://www.better-auth.com/docs/authentication/email-password)
- `resetPassword()` - Reset password with token[(2)](https://www.better-auth.com/docs/authentication/email-password)

**Email Verification:**
- `sendVerificationEmail()` - Send verification email[(2)](https://www.better-auth.com/docs/authentication/email-password)

## Server-Side Functions

Server-side `auth.api` calls are typically used for:

1. **Protected API routes/endpoints** - Where you need to verify authentication
2. **Server-only operations** - Like `setPassword()` which can only be called from the server for security reasons[(3)](https://www.better-auth.com/docs/concepts/users-accounts)
3. **Middleware/guards** - Using helpers like `isAuthenticated()` to protect routes[(4)](https://www.better-auth.com/docs/integrations/convex)

## Convex-Specific Pattern

With Convex integration, you have additional server helpers:


```typescript
// Server-side check
const hasToken = await isAuthenticated();

```

[(4)](https://www.better-auth.com/docs/integrations/convex)

And you can use Convex queries with preloading:


```typescript
// Preload in server component
const preloadedUserQuery = await preloadAuthQuery(api.auth.getCurrentUser);

// Use in client component
const user = usePreloadedAuthQuery(preloadedUserQuery);

```

[(4)](https://www.better-auth.com/docs/integrations/convex)

## Key Takeaway

**Use `authClient` for most operations from the client side**. The server-side `auth.api` is available but primarily for server-only security operations, API endpoints requiring authentication headers, or when you specifically need server-side execution[(1)](https://github.com/better-auth/better-auth/discussions/4927).