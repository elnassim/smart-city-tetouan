# Smart City Tetouan - Setup Guide

This guide will help you set up the Smart City Tetouan project on your local machine.

## Prerequisites

Make sure you have the following installed:

- **Java 17** or higher
- **Node.js 18+** and npm
- **Docker Desktop** (for Windows/Mac) or Docker Engine (for Linux)
- **Git**
- **Maven 3.8+**

## Step 1: Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Smart-City-Tetouan
```

## Step 2: Set Up Environment Variables

### Frontend Environment (.env)

Create a `.env` file in the `frontend` directory:

```bash
cd frontend
```

Create `.env` file with:

```env
# Clerk Authentication (you'll need to provide these)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Backend API
VITE_API_URL=http://localhost:8080
```

**Note:** You need to get the Clerk API keys from the project owner or create your own Clerk application at https://clerk.com

### Backend Environment

The backend services use Docker Compose, so most configuration is already set. However, you may need to configure:

1. **MySQL credentials** (already set in docker-compose.yml)
2. **Clerk Webhook Secret** (if using clerk-webhook-service)

## Step 3: Build and Start Backend Services

```bash
# Navigate to backend directory
cd backend

# Build all services (this may take 5-10 minutes the first time)
docker compose build

# Start all services
docker compose up -d

# Check if services are running
docker compose ps
```

You should see these services running:
- `mysql` - Database (port 3307)
- `zookeeper` - Kafka dependency
- `kafka` - Message broker (port 9092)
- `service-discovery` - Eureka (port 8761)
- `api-gateway` - Gateway (port 8080)
- `utility-service` - Main service (port 8081)
- `clerk-webhook-service` - Clerk webhooks (port 8082)
- `notification-service` - Notifications

**Wait 1-2 minutes** for all services to fully start.

### Verify Services

```bash
# Check service-discovery
curl http://localhost:8761

# Check utility-service health
curl http://localhost:8081/actuator/health

# View logs if needed
docker compose logs -f utility-service
```

## Step 4: Start Frontend

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend should start at `http://localhost:5173`

## Step 5: Access the Application

1. Open your browser and go to `http://localhost:5173`
2. You'll see the Clerk authentication screen
3. Sign up or sign in with Clerk
4. You should be redirected to the dashboard

## Testing the Claims Functionality

1. Navigate to the **Claims/Support** page
2. Fill out the claim form:
   - Title: "Water leak on street"
   - Description: "There is a water leak..."
   - Category: Select a category
   - Priority: Select priority
   - Add location details
3. Submit the claim
4. Verify the claim was created in Kafka:

```bash
docker exec -it kafka kafka-console-consumer --bootstrap-server kafka:9092 --topic claims.responses --from-beginning
```

You should see a JSON message with the claim details.

## Common Issues and Solutions

### Issue 1: Port Already in Use

If you get "port already in use" errors:

```bash
# Stop all containers
docker compose down

# Check what's using the port (example for port 3306)
netstat -ano | findstr :3306    # Windows
lsof -i :3306                   # Mac/Linux

# Kill the process or change the port in docker-compose.yml
```

### Issue 2: Services Not Starting

```bash
# Check logs
docker compose logs <service-name>

# Restart a specific service
docker compose restart <service-name>

# Rebuild and restart
docker compose build <service-name>
docker compose up -d <service-name>
```

### Issue 3: Database Connection Issues

```bash
# Make sure MySQL is fully started
docker compose logs mysql

# Wait for this message: "ready for connections"

# Restart dependent services
docker compose restart utility-service
```

### Issue 4: Frontend Can't Connect to Backend

1. Check if api-gateway is running: `curl http://localhost:8080`
2. Check CORS configuration in backend
3. Verify `.env` file has correct `VITE_API_URL=http://localhost:8080`

## Stopping the Application

```bash
# Stop all backend services
cd backend
docker compose down

# Or keep data and just stop
docker compose stop
```

Frontend: Just press `Ctrl+C` in the terminal where it's running.

## Architecture Overview

```
┌─────────────┐
│   Frontend  │ (React + Vite)
│  Port: 5173 │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ API Gateway │ (Spring Cloud Gateway)
│  Port: 8080 │
└──────┬──────┘
       │
       ↓
┌──────────────────┬──────────────────┬─────────────────┐
│                  │                  │                 │
│ Utility Service  │ Clerk Webhook    │ Notification    │
│  Port: 8081      │  Port: 8082      │    Service      │
└──────┬───────────┴──────────────────┴─────────────────┘
       │
       ↓
┌──────────────────┬─────────────────────┐
│                  │                     │
│   MySQL:3307     │   Kafka:9092        │
│                  │   Zookeeper         │
└──────────────────┴─────────────────────┘
```

## Development Workflow

1. **Backend changes:**
   ```bash
   cd backend
   # Make your changes to Java code
   mvn clean package -DskipTests  # in specific service directory
   docker compose build <service-name>
   docker compose up -d <service-name>
   ```

2. **Frontend changes:**
   - Just save the file, Vite will hot-reload automatically

3. **Database changes:**
   ```bash
   # Connect to MySQL
   docker exec -it mysql mysql -uroot -prootpassword smartcity_tetouan
   ```

## Need Help?

- Check the logs: `docker compose logs -f <service-name>`
- Verify all ports are free before starting
- Make sure Docker Desktop is running
- Contact the project owner for Clerk API keys

## Useful Commands Reference

```bash
# View all running containers
docker compose ps

# Stop all services
docker compose down

# Restart a service
docker compose restart <service-name>

# View logs
docker compose logs -f <service-name>

# Rebuild and restart all
docker compose down && docker compose build && docker compose up -d

# Access MySQL
docker exec -it mysql mysql -uroot -prootpassword smartcity_tetouan

# Monitor Kafka messages
docker exec -it kafka kafka-console-consumer --bootstrap-server kafka:9092 --topic claims.responses --from-beginning
```
