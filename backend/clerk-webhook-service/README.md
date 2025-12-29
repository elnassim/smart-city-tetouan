# Clerk Webhook Service

Receives Clerk webhook events and forwards sync requests to the User Service.

Quick start (dev):

1. Expose local webhook endpoint with ngrok:

   ngrok http 8082

   This gives you a public URL like `https://abcd-12-34-56.ngrok-free.app`.

2. Configure Clerk Dashboard → Webhooks

   Endpoint URL: `https://abcd-12-34-56.ngrok-free.app/api/clerk/webhook`
   Events: `user.created`, `user.updated`, `user.deleted`, `session.created`, `session.ended`

3. Set webhook secret in your environment :

   PowerShell:
   $env:CLERK_WEBHOOK_SECRET='sk_test_xxx'

   Linux/macOS:
   export CLERK_WEBHOOK_SECRET='sk_test_xxx'

4. If user service runs on a different host/port, set `user.service.url` env var e.g.: 

   $env:user__service__url='http://localhost:8083'

5. Build & run the service:

   cd backend/clerk-webhook-service
   mvn clean package
   java -jar target/clerk-webhook-service-0.0.1-SNAPSHOT.jar
