// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Enable performance monitoring
  tracesSampleRate: 1.0,

  // Set replaysSessionSampleRate to 1.0 to get 100% of sessions
  replaysSessionSampleRate: 0.1,

  // Set replaysOnErrorSampleRate to 1.0 to get 100% of sessions when an error occurs
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
