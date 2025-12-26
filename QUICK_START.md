# Quick Start - For Your Friend

## The Error You Got

```
ERROR [utility-service 2/2] COPY target/*.jar app.jar
failed to solve: lstat /target: no such file or directory
```

**Why?** The JAR files don't exist because you didn't build the Maven projects first!

---

## The Fix - Run These Commands

### Step 1: Navigate to Backend
```bash
cd backend
```

### Step 2: Build Maven Projects (REQUIRED!)
```bash
mvn clean install -DskipTests
```

This will take 2-3 minutes and create all the JAR files that Docker needs.

### Step 3: Build Docker Images
```bash
docker compose build
```

### Step 4: Start All Services
```bash
docker compose up -d
```

### Step 5: Wait & Verify
```bash
# Wait 1-2 minutes, then check
docker compose ps
```

You should see 8 services running!

---

## Full Commands (Copy-Paste)

```bash
cd backend
mvn clean install -DskipTests
docker compose build
docker compose up -d
docker compose ps
```

---

## Why Wasn't the JAR in Git?

The `.gitignore` file correctly ignores:
- `*.jar` files (compiled binaries)
- `target/` folders (build output)

This is **correct** - you should NEVER commit build artifacts to git. Everyone builds their own from the source code.

---

## Next: Start Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Then open: http://localhost:5173

---

## Need More Help?

Read the full guides:
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup with troubleshooting
- **[COLLABORATION_GUIDE.md](COLLABORATION_GUIDE.md)** - Daily workflow and git commands
