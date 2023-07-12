<!-- for time being just build your understanding -->

## General
### Area to see if you can understand

- [] lets focus on auth
  - [] start with understanding auth and sessions. files to view:
    - Most important file: ses.ts
    - authMain.ts for login, logout, and email verify
    - authCheck.ts this is protecting and verifying sessions.
    - authReset.ts
    - authSignUp.ts
  - [] see how session are stored and used and verified.
  - [] understand how session is passed in context for sesProcedure using middleware.
  - [] understand how we get the context types and pass it to functions, (when these functions are specifically used in trpc router)
