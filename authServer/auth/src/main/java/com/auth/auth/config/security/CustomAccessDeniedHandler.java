//package com.auth.auth.config.security;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.security.access.AccessDeniedException;
//import org.springframework.security.web.access.AccessDeniedHandler;
//import org.springframework.stereotype.Component;
//
//import javax.servlet.ServletException;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import java.io.IOException;
//
//@Component
//public class CustomAccessDeniedHandler implements AccessDeniedHandler {
//    private final static Logger logger = LoggerFactory.getLogger(CustomAccessDeniedHandler.class);
//
//
//    @Override
//    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
//        // 액세스 권한이 없는 리소스에 접근할 경우 발생하는 예외
//        // 돌아갈 리다이렉트 주소를 작성
//        response.sendRedirect("/auth/redir");
//    }
//}
