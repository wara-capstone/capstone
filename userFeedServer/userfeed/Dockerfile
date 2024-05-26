# 사용할 Java 이미지 지정
FROM openjdk:17-jdk

# 애플리케이션 파일을 컨테이너 내부로 복사
COPY userfeed-0.0.1-SNAPSHOT.jar app.jar

# 애플리케이션 실행 시 열릴 포트 지정
EXPOSE 8080

# JAR 파일 실행
ENTRYPOINT ["java", "-jar", "/app.jar"]