# Clerk authentication setup

StayRwanda uses Clerk for identity and MongoDB for application roles, organizations and memberships. The sign-in and registration pages use Clerk's prebuilt components, so every social connection enabled in Clerk appears automatically.

## 1. Create the Clerk application

1. Create an application in the Clerk Dashboard.
2. Enable email address and password under **User & authentication**.
3. Copy the Publishable Key and Secret Key from **API keys**.
4. Use development keys (`pk_test_` and `sk_test_`) locally and for disposable preview deployments.
5. Create a Clerk production instance before launch and use its `pk_live_` and `sk_live_` keys only with the production domain.

## 2. Configure local and Vercel variables

```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/account
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/account
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...
```

Add the variables in Vercel under **Project → Settings → Environment Variables**. Apply development keys to Preview and production keys to Production, then redeploy. Never expose `CLERK_SECRET_KEY` or `CLERK_WEBHOOK_SIGNING_SECRET` with a `NEXT_PUBLIC_` prefix.

## 3. Enable social sign-in

In Clerk, open **SSO connections**, choose **Add connection → For all users**, select a provider and enable it for sign-up and sign-in.

Recommended launch order:

1. Google
2. Apple
3. Facebook
4. Microsoft
5. GitHub

Development instances use Clerk's shared OAuth credentials for most providers. Production instances require provider-owned client credentials. Copy the exact redirect URI shown by Clerk into each provider console; do not invent a callback URL.

For production:

- Google: create a Web OAuth client, add the production origin and Clerk redirect URI, and publish the consent screen.
- Facebook: create a Meta app with Facebook Login, request email permission and add Clerk's valid OAuth redirect URI.
- Microsoft: create an Entra ID web app, allow organization and personal Microsoft accounts, and add Clerk's redirect URI.
- Apple: configure a Services ID, Team ID, Key ID and private key through the Apple Developer portal.
- GitHub: create an OAuth app and use the callback URL supplied by Clerk.

## 4. Configure the production domain

A Clerk production instance requires a domain you control. Add the domain in Clerk's **Domains** section, apply the requested DNS records, and add the same domain to the Vercel project. Use development Clerk keys for temporary `*.vercel.app` previews.

## 5. Configure user synchronization

Create a Clerk webhook endpoint:

```text
https://YOUR_DOMAIN/api/webhooks/clerk
```

Subscribe to `user.created`, `user.updated` and `user.deleted`. Copy the endpoint signing secret into `CLERK_WEBHOOK_SIGNING_SECRET` in Vercel and redeploy. Send a test event and confirm Clerk records a successful response.

## 6. Configure platform administration

Set `PLATFORM_ADMIN_EMAILS` in Vercel to a comma-separated list of trusted administrator email addresses. The email must match the primary verified email in Clerk. Application roles and hotel memberships remain server-enforced in MongoDB.

## Release check

- `/sign-in` shows enabled email and social strategies.
- `/register` creates a user and redirects to `/account`.
- Social sign-in returns to the requested `redirect_url`.
- The webhook test succeeds and creates or updates the MongoDB `users` record.
- A non-admin cannot access `/admin`.
- A platform-admin email can access `/admin` after signing out and back in.
