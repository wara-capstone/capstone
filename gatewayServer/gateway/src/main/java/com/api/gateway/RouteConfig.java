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
                //payment
                .route("payment-service", r->r.path("/api/payment/**")
                        .filters(f->f.filter(authFilter.apply(config -> {config.setRequiredRole("role_user");})))
                        .uri("lb://PAYMENT-SERVICE"))


                // shoppingCart
                .route("cart-service", r->r.path("/api/cart/**")
                        .filters(f->f.filter(authFilter.apply(config -> {config.setRequiredRole("role_user");})))
                        .uri("lb://CART-SERVICE"))

                // chat
                .route("chat-service", r->r.path("/api/ws/**")
                        .filters(f->f.filter(authFilter.apply(config -> {config.setRequiredRole("role_user");})))
                        .uri("lb://CHATTING-SERVICE"))
                .route("chat-service", r->r.path("/api/chat/**")
                        .filters(f->f.filter(authFilter.apply(config -> {config.setRequiredRole("role_user");})))
                        .uri("lb://CHATTING-SERVICE"))

                // product
                .route("product-service", r->r.path("/api/product/all/**")
                        .uri("lb://PRODUCT-SERVICE"))
                .route("product-service", r->r.path("/api/product/user/**")
                        .filters(f->f.filter(authFilter.apply(config -> {config.setRequiredRole("role_user");})))
                        .uri("lb://PRODUCT-SERVICE"))
                .route("product-service", r->r.path("/api/product/seller/**")
                        .filters(f->f.filter(authFilter.apply(config -> {config.setRequiredRole("role_seller");})))
                        .uri("lb://PRODUCT-SERVICE"))

                // store
                .route("store-service", r->r.path("/api/store/delete")
                        .filters(f->f.filter(authFilter.apply(config -> {config.setRequiredRole("role_seller");})))
                        .uri("lb://STORE-SERVICE"))
                .route("store-service", r->r.path("/api/store/update")
                        .filters(f->f.filter(authFilter.apply(config -> {config.setRequiredRole("role_seller");})))
                        .uri("lb://STORE-SERVICE"))
                .route("store-service", r->r.path("/api/store/create")
                        .filters(f->f.filter(authFilter.apply(config -> {config.setRequiredRole("role_seller");})))
                        .uri("lb://STORE-SERVICE"))
                .route("store-service", r->r.path("/api/store/**")
                        .uri("lb://STORE-SERVICE"))

                // auth, user
                .route("auth-service", r -> r.path("/api/auth/**")
                        //.filters() filters를 제작하여 인증처리 
                        .uri("lb://USER-SERVICE"))
                .route("user-service", r->r.path("/api/user/**")
                        .filters(f->f.filter(authFilter.apply(config -> {config.setRequiredRole("role_user");})))
                        .uri("lb://USER-SERVICE"))
                // image
                .route("image-download", r -> r.path("/api/image/download/**")
                        .uri("lb://IMAGE-SERVICE"))

                // test
                .route("test-service", r -> r.path("/api/test/**")
                        .filters(f -> f.filter(authFilter.apply(config -> {config.setRequiredRole("role_admin");})))
                        .uri("lb://TEST"))
                .route("test-service", r -> r.path("/api/testt/**")
                        .filters(f -> f.filter(authFilter.apply(config -> {config.setRequiredRole("role_seller");})))
                        .uri("lb://TEST"))
                        .build();
    }

}
