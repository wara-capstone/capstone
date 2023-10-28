//package com.auth.auth.config.security;
//
//
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.web.AuthenticationEntryPoint;
//import org.springframework.stereotype.Component;
//
//import javax.servlet.ServletException;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import java.io.IOException;
//
//@Component
//public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
//    @Override
//    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
//        // 인증이 실패할 경우 들어오는 예외
//
//        String entryPointErrorResponse = "인증에 실패하셨습니다.";
//
//        response.sendError(401, entryPointErrorResponse);
//
//
//    }
//}
