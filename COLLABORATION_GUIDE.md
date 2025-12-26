# Collaboration Guide - Working Together

## Quick Start for New Team Members

### What You'll Need from the Project Owner

1. **GitHub Repository Access**
   - Ask the owner to add you as a collaborator

2. **Clerk API Keys**
   - `VITE_CLERK_PUBLISHABLE_KEY` for the frontend
   - These are needed for authentication to work

3. **Any Other Credentials**
   - Webhook secrets (if using clerk-webhook-service)

---

## Your First Setup (One-Time)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Smart-City-Tetouan
```

### 2. Set Up Frontend Environment
```bash
cd frontend
```

Create `.env` file:
```env
VITE_CLERK_PUBLISHABLE_KEY=<ask_project_owner_for_this>
VITE_API_URL=http://localhost:8080
```

### 3. Build and Start Backend Services
```bash
cd ../backend

# CRITICAL: Build Maven projects first (creates JAR files)
mvn clean install -DskipTests

# Then build and start Docker containers
docker compose build
docker compose up -d
```

Wait 1-2 minutes for services to start.

### 4. Start Frontend
```bash
cd ../frontend
npm install
npm run dev
```

### 5. Open Browser
Go to `http://localhost:5173`

---

## Daily Development Workflow

### Starting Work

```bash
# 1. Pull latest changes
git pull origin main

# 2. Start backend (if not running)
cd backend
docker compose up -d

# 3. Start frontend (in a new terminal)
cd frontend
npm run dev
```

### Making Changes

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Test your changes:**
   - Backend: Rebuild the service
     ```bash
     cd backend/<service-name>
     mvn clean package -DskipTests
     cd ..
     docker compose build <service-name>
     docker compose up -d <service-name>
     ```

   - Frontend: Vite auto-reloads, just save

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

5. **Push your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

### Before Ending Your Day

```bash
# Commit your work
git add .
git commit -m "Work in progress: <description>"
git push origin <your-branch>

# Stop services to free resources (optional)
cd backend
docker compose stop
```

---

## Working on Different Features

### Avoiding Conflicts

1. **Communicate:** Tell your teammate which files you're working on
2. **Small commits:** Commit frequently with clear messages
3. **Pull often:** Run `git pull origin main` regularly
4. **Separate branches:** Each feature gets its own branch

### If You Get Merge Conflicts

```bash
# 1. Pull latest main
git checkout main
git pull origin main

# 2. Go back to your branch
git checkout your-branch

# 3. Merge main into your branch
git merge main

# 4. Resolve conflicts in your editor
# Look for <<<<<<< and >>>>>>> markers

# 5. After resolving, commit
git add .
git commit -m "Resolved merge conflicts"
git push origin your-branch
```

---

## Useful Commands

### Backend (Docker)

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Restart a specific service
docker compose restart utility-service

# View logs
docker compose logs -f utility-service

# Check service status
docker compose ps

# Rebuild after code changes
docker compose build utility-service
docker compose up -d utility-service
```

### Frontend

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Database

```bash
# Connect to MySQL
docker exec -it mysql mysql -uroot -prootpassword smartcity_tetouan

# View tables
SHOW TABLES;

# Query data
SELECT * FROM claims;
```

### Kafka Testing

```bash
# Monitor claim responses
docker exec -it kafka kafka-console-consumer --bootstrap-server kafka:9092 --topic claims.responses --from-beginning

# Monitor status updates
docker exec -it kafka kafka-console-consumer --bootstrap-server kafka:9092 --topic claims.status-updates --from-beginning
```

---

## Project Structure

```
Smart-City-Tetouan/
├── backend/
│   ├── service-discovery/      # Eureka server
│   ├── api-gateway/            # API Gateway
│   ├── utility-service/        # Main business logic
│   ├── clerk-webhook-service/  # Clerk webhooks
│   ├── notification-service/   # Notifications
│   ├── kafka-commons/          # Shared Kafka DTOs
│   └── docker-compose.yml      # All backend services
│
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API calls
│   │   └── utils/             # Utilities
│   └── package.json
│
└── SETUP_GUIDE.md             # Detailed setup instructions
```

---

## Key Services & Ports

| Service              | Port  | Purpose                          |
|---------------------|-------|----------------------------------|
| Frontend            | 5173  | React application                |
| API Gateway         | 8080  | Routes all frontend requests     |
| Utility Service     | 8081  | Claims, dashboard, users         |
| Clerk Webhook       | 8082  | Handles Clerk events             |
| Service Discovery   | 8761  | Eureka - service registry        |
| MySQL               | 3307  | Database                         |
| Kafka               | 9092  | Message broker                   |

---

## Common Development Tasks

### Adding a New API Endpoint

1. **Backend (utility-service):**
   ```java
   // Create DTO in dto/ folder
   // Add method in service layer
   // Add endpoint in controller
   ```

2. **Rebuild:**
   ```bash
   cd backend/utility-service
   mvn clean package -DskipTests
   cd ..
   docker compose build utility-service
   docker compose up -d utility-service
   ```

3. **Frontend:**
   ```javascript
   // Add API call in services/
   // Use in component
   ```

### Adding a New Page

1. Create component in `frontend/src/pages/`
2. Add route in `App.jsx`
3. Add navigation link if needed

### Testing the Full Flow

1. Make changes
2. Rebuild backend service (if needed)
3. Test in browser
4. Check Kafka messages (if applicable)
5. Verify database changes (if applicable)

---

## Communication Tips

✅ **DO:**
- Communicate before working on the same file
- Write clear commit messages
- Test before pushing
- Ask questions if stuck
- Document complex changes

❌ **DON'T:**
- Work on `main` branch directly
- Push untested code
- Commit broken code
- Commit sensitive data (API keys, passwords)

---

## Getting Help

1. **Check logs:** `docker compose logs -f <service>`
2. **Verify services:** `docker compose ps`
3. **Read SETUP_GUIDE.md** for detailed troubleshooting
4. **Ask your teammate** - collaboration is key!

---

## Git Best Practices

```bash
# Always work on a feature branch
git checkout -b feature/add-notifications

# Commit small, logical changes
git add src/components/NotificationBell.jsx
git commit -m "Add notification bell component"

# Pull before pushing
git pull origin main

# Push your branch
git push origin feature/add-notifications

# Create PR on GitHub
# After PR is approved and merged, delete your branch
git checkout main
git pull origin main
git branch -d feature/add-notifications
```

---

## Quick Reference: First Day Checklist

- [ ] Clone repository
- [ ] Get Clerk API keys from owner
- [ ] Create frontend `.env` file
- [ ] Install Docker Desktop
- [ ] Run `docker compose up -d` in backend folder
- [ ] Run `npm install && npm run dev` in frontend folder
- [ ] Open http://localhost:5173
- [ ] Create a test claim to verify everything works
- [ ] Check Kafka messages
- [ ] Celebrate! 🎉

---

**Happy Coding! 🚀**
