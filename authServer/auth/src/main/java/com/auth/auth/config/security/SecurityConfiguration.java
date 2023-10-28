//package com.auth.auth.config.security;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//
//@Configuration
//public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
//    private final JwtTokenProvider jwtTokenProvider;
//
//    public SecurityConfiguration(
//            @Autowired JwtTokenProvider jwtTokenProvider
//    ){
//        this.jwtTokenProvider = jwtTokenProvider;
//    }
//
//
//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//        // UI를 사용하는 것을 기본값으로 가진 시큐리티 설정을 비활성화
//        http.httpBasic().disable()
//                // REST API에서는 CSRF 보안이 필요 없다.
//                .csrf().disable()
//                // session 기능 제거
//                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                .and()
//                // antPattern을 통해 권한을 설정
//                // 아래에 작성되는 주소들은 모두 허용
//                .authorizeRequests()
//                // 허용할 주소 ex: 로그인, 회원가입
//                .antMatchers("/auth/**", "/image/**", "/openapi/data/**").permitAll()
//                // 인증이 완료되면 모든 api 접근 허용
//                .antMatchers("/**").authenticated()
//                // 개발용 설정
//                //.anyRequest().hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
//                .anyRequest().hasRole("ADMIN")
//                .and()
//                // 권한을 통과하지 못할 경우 예외 전달
//                .exceptionHandling().accessDeniedHandler(new CustomAccessDeniedHandler())
//                .and()
//                // 인증에서 예외가 발생한 경우 예외 전달
//                .exceptionHandling().authenticationEntryPoint(new CustomAuthenticationEntryPoint())
//                .and().cors()
//                .and()
//                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
//                        UsernamePasswordAuthenticationFilter.class);
//
//    }
//    // CORS 허용
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.addAllowedOrigin("http://127.0.0.1:5173");
//        configuration.addAllowedMethod("*");
//        configuration.addAllowedHeader("*");
//        configuration.setAllowCredentials(true);
//        configuration.setMaxAge(3600L);
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }
//
//}
