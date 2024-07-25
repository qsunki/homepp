# Step 1: Base image with JDK 21 and Gradle
FROM gradle:8.8-jdk21 AS build

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy Gradle wrapper and build scripts
COPY build.gradle settings.gradle /app/

# Step 4: Copy source code
COPY src /app/src

# Step 5: Build the application
RUN gradle build --no-daemon

# Step 6: Base image for runtime with JDK 21
FROM openjdk:21-jdk-slim

# Step 7: Set the working directory
WORKDIR /app

# Step 8: Copy the built JAR file from the build stage
COPY --from=build /app/build/libs/backend-0.0.1-SNAPSHOT.jar app.jar

# Step 9: Specify the entry point for the application
ENTRYPOINT ["java", "-jar", "app.jar"]

# Expose the port the application runs on
EXPOSE 8080
