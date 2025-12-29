# User Service

This microservice stores Clerk users and exposes helper endpoints used by the rest of the platform.

Endpoints:
- POST /api/users — create/update user (called by Clerk webhook service)
- DELETE /api/users/{clerkId} — delete user
- POST /api/users/sessions — session sync (lightweight)
- GET /api/users/me — return current logged user (requires Authorization header: Bearer <JWT>)
- GET /api/users — list all users (for admin)

Run locally :
- from repo root:
  cd backend/user-service
  mvn clean package
  java -jar target/user-service-0.0.1-SNAPSHOT.jar
