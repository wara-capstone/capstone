package com.api.gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;


@Component
public class AuthorizationHeaderFilter extends AbstractGatewayFilterFactory<AuthorizationHeaderFilter.Config> {
    // application.yml에서 값 추출 객

    @Value(value = "${springboot.jwt.secret}")
    private String secretKey;
    private final static Logger logger = LoggerFactory.getLogger(AuthorizationHeaderFilter.class);

    public AuthorizationHeaderFilter() {
        super(Config.class);
    }

    @PostConstruct
    protected void init(
    ){
        logger.info("[JwtTokenProvider] init, secretKey 초기화");
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public GatewayFilter apply(AuthorizationHeaderFilter.Config config) {
        return (exchange, chain) -> {
            String requiredRole = config.getRequiredRole();
            ServerHttpRequest request = exchange.getRequest();
            // Authorization 헤더 없다면 에러
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) return onError(exchange, "No authorization header", HttpStatus.UNAUTHORIZED);
            //헤더값
            String authorizationHeader = request.getHeaders().get(HttpHeaders.AUTHORIZATION).get(0);
            // jwt
            String jwt = authorizationHeader.replace("Bearer ", "");
            logger.info(jwt);
            if (!isJwtValid(jwt)) return onError(exchange, "JWT token is not valid", HttpStatus.UNAUTHORIZED);
            logger.info("JWT VALID");
            String userRole = resolveTokenRole(jwt).replace("[", "").replace("]", "");
            logger.info(userRole);
            // 인가처리
            if(requiredRole.equalsIgnoreCase("role_admin")){
                if(!userRole.equalsIgnoreCase("role_admin")) return onError(exchange, "do not have permission", HttpStatus.FORBIDDEN);
            }else if(requiredRole.equalsIgnoreCase("role_seller")){
                if(!userRole.equalsIgnoreCase("role_seller") && !userRole.equalsIgnoreCase("role_admin"))
                    return onError(exchange, "do not have permission", HttpStatus.FORBIDDEN);
            }

            return chain.filter(exchange);
        };
    }
    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        logger.error(err);
        return response.setComplete();
    }

    private String resolveTokenRole(String token){
        try {
            String subject = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().get("roles").toString();
            return subject;
        }catch (Exception e){
            logger.info("유저 권한 체크 실패");
            return "e";
        }
    }

    private boolean isJwtValid(String token) {
        logger.info("[JwtTokenProvider] validateToken, 토큰 유효성 체크");
        try{
            Jws<Claims> claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return !claims.getBody().getExpiration().before(new Date());
        } catch (Exception e){
            e.printStackTrace();
            logger.info("[JwtTokenProvider] validateToken, 토큰 유효성 체크 예외 발생");
            return false;
        }
    }
    public static class Config {
        private String requiredRole;

        public String getRequiredRole() {
            return requiredRole;
        }

        public void setRequiredRole(String requiredRole) {
            this.requiredRole = requiredRole;
        }
    }
}
