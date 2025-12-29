## Run locally 

1. Copy the example env file and fill values :

2. Run the dev stack:

- Run containers:
from root

  docker compose up -d

- Start frontend
from root

  npm install @clerk/next js
  npm run dev

- Start User Service

<!-- "it's better to use jdk 22 or less
  $env:JAVA_HOME = 'C:\Program Files\Java\jdk-22'
  $env:PATH = "${env:JAVA_HOME}\bin;${env:PATH}" -->


  cd backend/user-service
  mvn clean package
  java -jar target/user-service-0.0.1-SNAPSHOT.jar

- Start ngrok

  ngrok http 8082

- Run Clerk Webhook Service

  cd backend/clerk-webhook-service
  mvn -DskipTests package
  java -jar target/clerk-webhook-service-0.0.1-SNAPSHOT.jar

- Start Traffic Service
  cd backend
  mvn clean package
  KAFKA_BOOTSTRAP=redpanda:9092 mvn spring-boot:run -DskipTests



