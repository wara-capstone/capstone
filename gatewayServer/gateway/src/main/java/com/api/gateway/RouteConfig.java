package com.api.gateway;

import com.api.gateway.security.AuthorizationHeaderFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {


    // 라우트
    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder,
                                      AuthorizationHeaderFilter authFilter) {
        return builder.routes()
                // chat
                .route("chat-service", r->r.path("/ws/**")
                        .filters(f->f.filter(authFilter.apply(config -> {config.setRequiredRole("role_user");})))
                        .uri("lb://CHATTING-SERVICE"))
                .route("chat-service", r->r.path("/chat/**")
                        .filters(f->f.filter(authFilter.apply(config -> {config.setRequiredRole("role_user");})))
                        .uri("lb://CHATTING-SERVICE"))
                // store
                .route("store-service", r->r.path("/store/delete")
                        .filters(f->f.filter(authFilter.apply(config -> {config.setRequiredRole("role_seller");})))
                        .uri("lb://STORE-SERVICE"))
                .route("store-service", r->r.path("/store/update")
                        .filters(f->f.filter(authFilter.apply(config -> {config.setRequiredRole("role_seller");})))
                        .uri("lb://STORE-SERVICE"))
                .route("store-service", r->r.path("/store/create")
                        .filters(f->f.filter(authFilter.apply(config -> {config.setRequiredRole("role_seller");})))
                        .uri("lb://STORE-SERVICE"))
                .route("store-service", r->r.path("/store/**")
                        .uri("lb://STORE-SERVICE"))
                // auth, user
                .route("auth-service", r -> r.path("/auth/**")
                        //.filters() filters를 제작하여 인증처리 
                        .uri("lb://USER-SERVICE"))
                .route("user-service", r->r.path("/user/**")
                        .filters(f->f.filter(authFilter.apply(config -> {config.setRequiredRole("role_user");})))
                        .uri("lb://USER-SERVICE"))
                // image
                .route("image-download", r -> r.path("/image/download/**")
                        .uri("lb://IMAGE-SERVICE"))

                // test
                .route("test-service", r -> r.path("/test/**")
                        .filters(f -> f.filter(authFilter.apply(config -> {config.setRequiredRole("role_admin");})))
                        .uri("lb://TEST"))
                .route("test-service", r -> r.path("/testt/**")
                        .filters(f -> f.filter(authFilter.apply(config -> {config.setRequiredRole("role_seller");})))
                        .uri("lb://TEST"))
                        .build();
    }

}
