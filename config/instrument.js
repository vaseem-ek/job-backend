// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://854ee93ef2c3850510e7e63a9ab957f4@o4508941369278464.ingest.us.sentry.io/4508941375307776",
  integrations:[
    Sentry.mongooseIntegration()
  ]
});