# Use a base image with Java 21 (matching your project)
FROM eclipse-temurin:21-jdk-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper and pom.xml first to leverage Docker cache
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Ensure mvnw is executable
RUN chmod +x mvnw

# Download dependencies (this step is cached if pom.xml doesn't change)
RUN ./mvnw dependency:resolve

# Copy the source code
COPY src ./src

# Build the application
RUN ./mvnw package -DskipTests

# Expose the port the app runs on
EXPOSE 8083

# Command to run the application
CMD ["sh", "-c", "java -jar target/*.jar"]
