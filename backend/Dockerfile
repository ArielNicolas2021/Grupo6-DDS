FROM eclipse-temurin:17-jdk
ARG JAR_FILE=target/finance-app-0.0.1.jar
COPY ${JAR_FILE} gestion-gastos.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "gestion-gastos.jar"]