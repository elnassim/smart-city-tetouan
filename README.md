# Smart City Tetouan

> A comprehensive smart city utility management platform for monitoring and managing water and electricity consumption in Tetouan.

## Overview

Smart City Tetouan is a full-stack web application built with a microservices architecture that enables citizens to monitor their utility consumption, view bills, and submit claims, while providing administrators with powerful management tools for users, meters, and system analytics.

## Features

### For Citizens
- Real-time water and electricity consumption monitoring
- Interactive consumption charts and trends
- Monthly billing summaries with detailed breakdowns
- Alert notifications for consumption anomalies
- Claims submission and tracking
- Consumption history analysis

### For Administrators
- User management with role-based access control (ADMIN, CITOYEN, OPERATOR)
- Meter management (CRUD operations for water/electricity meters)
- Claims and complaint handling system
- System analytics and consumption reports
- Revenue tracking and analytics
- Dashboard with key metrics and statistics

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.0 with Spring Cloud 2023.0.0
- **Architecture**: Microservices with API Gateway and Service Discovery
- **Database**: MySQL 8.0
- **Message Queue**: Apache Kafka with Zookeeper
- **Authentication**: Clerk OAuth2
- **Build Tool**: Maven (multi-module project)
- **Containerization**: Docker with Docker Compose

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Router**: React Router 7.10.1
- **Authentication**: Clerk React SDK 5.58.1
- **Styling**: Tailwind CSS 4.1.18
- **HTTP Client**: Axios
- **Icons**: Lucide React, Font Awesome

## Architecture

The application follows a microservices architecture with the following components:

### Microservices

1. **API Gateway** (Port 8080)
   - Central entry point for all client requests
   - JWT authentication validation
   - Request routing to appropriate microservices

2. **Service Discovery / Eureka Server** (Port 8761)
   - Service registry and discovery
   - Health checks and load balancing

3. **Utility Service** (Port 8081)
   - Core business logic
   - Water and electricity meter management
   - Billing and consumption tracking
   - Dashboard data aggregation

4. **Clerk Webhook Service** (Port 8082)
   - User synchronization with Clerk
   - Session tracking
   - Webhook event handling

5. **Notification Service** (Port 8083)
   - Event-driven notifications via Kafka
   - User alerts and notifications

6. **Kafka Commons**
   - Shared Kafka DTOs and configurations

### Architecture Patterns
- API Gateway Pattern
- Service Registry Pattern
- Event-Driven Architecture
- Backend for Frontend (BFF)
- Container Orchestration

## Project Structure

```
Smart-City-Tetouan/
├── backend/
│   ├── api-gateway/              # API Gateway (Port 8080)
│   ├── service-discovery/        # Eureka Server (Port 8761)
│   ├── utility-service/          # Core business logic (Port 8081)
│   ├── clerk-webhook-service/    # Clerk integration (Port 8082)
│   ├── notification-service/     # Notifications (Port 8083)
│   ├── kafka-commons/            # Shared Kafka utilities
│   ├── parent-pom.xml            # Maven parent configuration
│   ├── docker-compose.yml        # Container orchestration
│   └── water_electricity_management.sql  # Database schema
├── frontend/
│   ├── src/
│   │   ├── pages/                # Application pages
│   │   │   ├── Dashboard/        # Citizen dashboard
│   │   │   ├── Admin/            # Admin pages
│   │   │   ├── Claims/           # Claims management
│   │   │   └── Consumption/      # Consumption tracking
│   │   ├── components/           # Reusable components
│   │   ├── services/             # API services
│   │   └── App.jsx               # Main application
│   ├── package.json
│   └── vite.config.js
├── IMPLEMENTATION_GUIDE.md       # Implementation roadmap
├── LOAD_DATA_INSTRUCTIONS.md     # Database setup guide
└── README.md
```

## Getting Started

### Prerequisites

- **Java**: JDK 17 or higher
- **Node.js**: v18 or higher
- **Maven**: 3.8 or higher
- **Docker**: Latest version with Docker Compose
- **MySQL**: 8.0 (or use Docker)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Smart-City-Tetouan/backend
   ```

2. **Build the project**
   ```bash
   mvn clean install -f parent-pom.xml
   ```

3. **Start services with Docker Compose**
   ```bash
   docker-compose up --build
   ```

   This will start:
   - MySQL database (Port 3306)
   - Kafka & Zookeeper (Ports 9092, 2181)
   - Eureka Server (Port 8761)
   - API Gateway (Port 8080)
   - Utility Service (Port 8081)
   - Clerk Webhook Service (Port 8082)
   - Notification Service (Port 8083)

4. **Initialize the database**
   - Import the schema: `water_electricity_management.sql`
   - Load sample data: `sample-data.sql`
   - See [LOAD_DATA_INSTRUCTIONS.md](LOAD_DATA_INSTRUCTIONS.md) for details

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Accessing the Application

- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **Utility Service**: http://localhost:8081

## Authentication

The application uses **Clerk** for authentication and authorization.

### User Roles
- **ADMIN**: Full access to admin dashboard and management features
- **CITOYEN** (Citizen): Access to personal dashboard, consumption, and claims
- **OPERATOR**: Access to operational features

### Authentication Flow
1. User signs in via Clerk hosted UI
2. Clerk issues JWT token
3. Frontend includes JWT in API requests
4. API Gateway validates JWT
5. Clerk sends webhook events to sync user data

## API Documentation

### Base URLs
- **API Gateway**: `http://localhost:8080/api`
- **Utility Service** (Direct): `http://localhost:8081/api`

### Key Endpoints

#### Dashboard
- `GET /dashboard/summary/clerk/{clerkUserId}` - Get dashboard summary

#### Consumption
- `GET /consumption/history/{userId}?period={period}` - Get consumption history
- `GET /consumption/meter/{meterId}` - Get meter consumption

#### Billing
- `GET /billing/user/{userId}` - Get user bills
- `POST /billing/{billId}/pay` - Pay a bill

#### Claims
- `GET /claims/user/{userId}` - Get user claims
- `POST /claims` - Create new claim

#### Admin - Users
- `GET /admin/users` - List all users
- `PUT /admin/users/{userId}/role` - Update user role
- `DELETE /admin/users/{userId}` - Delete user

#### Admin - Meters
- `GET /admin/meters` - List all meters
- `POST /admin/meters` - Create new meter
- `PUT /admin/meters/{meterId}` - Update meter
- `DELETE /admin/meters/{meterId}` - Delete meter

#### Admin - Analytics
- `GET /admin/stats` - Get system statistics
- `GET /admin/analytics/consumption?period={period}` - Consumption analytics
- `GET /admin/analytics/revenue?period={period}` - Revenue analytics

## Database Schema

### Main Tables
- **users** - User accounts with roles
- **meters** - Water and electricity meters
- **meter_readings** - Consumption readings
- **bills** - Billing information
- **notifications** - User alerts
- **claims** - User complaints and claims

### Entity Relationships
```
User (1) ──── (N) Meter
Meter (1) ──── (N) MeterReading
Meter (1) ──── (N) Bill
User (1) ──── (N) Notification
User (1) ──── (N) Claim
```

## Configuration

### Backend Configuration

Each microservice has its own `application.yml` configuration file:

**Utility Service** (`backend/utility-service/src/main/resources/application.yml`):
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/water_electricity_management
    username: root
    password: nassim123
```

**API Gateway** (`backend/api-gateway/src/main/resources/application.yml`):
```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://your-clerk-instance.clerk.accounts.dev
          jwk-set-uri: https://api.clerk.com/v1/.well-known/jwks.json
```

### Frontend Configuration

**Environment Variables** (`.env`):
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=http://localhost:8080/api
```

## Development

### Running Services Individually

**Eureka Server**:
```bash
cd backend/service-discovery
mvn spring-boot:run
```

**API Gateway**:
```bash
cd backend/api-gateway
mvn spring-boot:run
```

**Utility Service**:
```bash
cd backend/utility-service
mvn spring-boot:run
```

### Building for Production

**Backend**:
```bash
cd backend
mvn clean package -f parent-pom.xml
```

**Frontend**:
```bash
cd frontend
npm run build
```

## Testing

### Sample Data

The project includes sample data with:
- Multiple user accounts (citizens, operators, admin)
- Water and electricity meters
- 30 days of consumption readings
- Sample bills and notifications
- Test claims

Follow [LOAD_DATA_INSTRUCTIONS.md](LOAD_DATA_INSTRUCTIONS.md) to load sample data.

### Test Accounts

After loading sample data, you can use the following test accounts (create via Clerk with matching emails):
- Admin user with ADMIN role
- Regular citizen with CITOYEN role
- Operator with OPERATOR role

## Troubleshooting

### Common Issues

**Services not starting**:
- Ensure all ports (8080, 8081, 8082, 8083, 8761, 3306, 9092) are available
- Check Docker is running
- Verify MySQL credentials

**Database connection errors**:
- Ensure MySQL is running (via Docker or locally)
- Verify database credentials in application.yml files
- Check database exists: `water_electricity_management`

**Frontend API errors**:
- Verify API Gateway is running on port 8080
- Check CORS configuration in backend
- Ensure Clerk publishable key is correct

**Authentication issues**:
- Verify Clerk configuration
- Check JWT token validation settings
- Ensure webhook service is receiving events

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Implementation Status

### Completed
- ✅ Microservices infrastructure
- ✅ Clerk authentication integration
- ✅ Database schema and sample data
- ✅ Dashboard API and UI
- ✅ Admin management interfaces
- ✅ Citizen dashboard with charts

### Partial
- ⚠️ Claims submission (UI ready, backend minimal)
- ⚠️ Consumption history page
- ⚠️ Notification service
- ⚠️ Kafka event processing

### Pending
- ❌ Professional UI design enhancements
- ❌ Payment processing integration
- ❌ Complete notification delivery
- ❌ Mobile app development

See [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for the full roadmap.

## Security

### Implemented
- ✅ JWT token validation at API Gateway
- ✅ Webhook signature verification
- ✅ CORS configuration
- ✅ Role-based access control
- ✅ HTTPS for Clerk authentication

### Recommendations for Production
- Implement secrets management (HashiCorp Vault, AWS Secrets Manager)
- Enable HTTPS/TLS for all services
- Add rate limiting and API throttling
- Implement circuit breakers
- Set up monitoring and logging (ELK stack)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact the development team.

## Acknowledgments

- Spring Boot and Spring Cloud communities
- Clerk for authentication services
- React and Vite communities
- Tailwind CSS team
- Apache Kafka project

---

**Smart City Tetouan** - Building the future of urban utility management
