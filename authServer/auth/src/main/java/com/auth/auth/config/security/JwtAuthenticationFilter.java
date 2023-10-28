//package com.auth.auth.config.security;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import javax.servlet.FilterChain;
//import javax.servlet.ServletException;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import java.io.IOException;
//
//public class JwtAuthenticationFilter extends OncePerRequestFilter {
//    private final static Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
//    private final JwtTokenProvider jwtTokenProvider;
//
//    public JwtAuthenticationFilter(
//            @Autowired JwtTokenProvider jwtTokenProvider
//    ){
//        this.jwtTokenProvider = jwtTokenProvider;
//    }
//
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//        String token = jwtTokenProvider.resolveToken(request);
//        logger.info("[JwtAuthenticationFilter] 토큰 추출  "+ token);
//
//        if(token != null && jwtTokenProvider.validateToken(token)){
//            // ContextHolder에 추가하기 위한 Authentication을 생성한다.
//            Authentication authentication = jwtTokenProvider.getAuthentication(token);
//            // ContetHolder에 Authentication 추가출
//            SecurityContextHolder.getContext().setAuthentication(authentication);
//            logger.info("[JwtAuthenticationFilter] 유효성 체크 완료");
//        }
//
//        filterChain.doFilter(request, response);
//
//    }
//}
