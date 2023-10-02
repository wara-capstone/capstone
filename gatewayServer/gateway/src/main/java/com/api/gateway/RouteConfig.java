package com.api.gateway;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {


    // 라우트
    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                //first-service
                .route(r -> r.path("/user/**")
                        //.filters() filters를 제작하여 인증처리 
                        .uri("lb://USER-SERVICE"))
                .build();
    }

}
