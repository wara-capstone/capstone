# Use Amazon Corretto 11
FROM amazoncorretto:11

# Set the working directory in container
WORKDIR /app

# Copy the spring boot application jar to the container
COPY build/libs/*.jar app.jar

# Expose the application port
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
