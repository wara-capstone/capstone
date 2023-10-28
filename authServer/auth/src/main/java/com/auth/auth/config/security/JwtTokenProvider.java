package com.auth.auth.config.security;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
    private final static Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);
    //  private final UserDetailsService userDetailsService;


    // application.yml에 있는 설정 값을 가져온다. 가져올 수 없다면 기본값 "secretKey"사용
    // @Value(value = "${springboot.jwt.secret}")
    @Value(value = "${springboot.jwt.secret}")
    private String secretKey;
    // 토큰의 유효 기간 (1시간)
    private final long tokenValidMillisecond = 1000L * 60 * 60;

    // secretKey를 Base64 인코딩 합니다.
    // PostConstruct는 빈객체로 주입될 때 자동으로 시작되는 메서드
    @PostConstruct
    protected void init(
    ){
        logger.info("[JwtTokenProvider] init, secretKey 초기화");
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes(StandardCharsets.UTF_8));
    }


    public String createToken(String userUid, List<String> roles){
        logger.info("[JwtTokenProvider] createToken, 토큰 생성");
        // Jwt token의 값을 넣기 위한 claims, sub 속성(제목)에 유저의 ID 삽입
        Claims claims = Jwts.claims().setSubject(userUid);
        // 유저의 권한 목록을 삽입
        claims.put("roles", roles);
        Date now = new Date();

        String token = Jwts.builder()
                .setClaims(claims)
                // 토큰 생성 시간
                .setIssuedAt(now)
                // 토큰의 만료 기간을 설정
                .setExpiration(new Date(now.getTime() + tokenValidMillisecond))
                // 암호화 알고리즘 및 암호화에 사용되는 키 설정
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();

        return token;
    }

//    @Transactional
//    public Authentication getAuthentication(String token){
//        logger.info("[JwtTokenProvider] getAuthentication, 토큰 인증 조회 시작");
//        // UserDetailsService를 이용해 유저의 ID로 UserEntity를 가져온다.
//        UserDetails userDetails = userDetailsService.loadUserByUsername(this.getUsername(token));
//
//        logger.info("[JwtTokenProvider] getAuthentication userName : " + userDetails.getUsername());
//
//        // Authentication을 상속하는 usernamePassword~~를 생성
//        // Authentication을 ContextHolder에 추가하여 유저를 검증한다.
//        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
//    }


    public String getUsername(String token){
        logger.info("[JwtTokenProvider] getUsername 토큰 기반 유저 ID 추출");
        // 토큰에서 Subject에 있는 유저의 ID를 추출한다.
        String info = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
        return info;
    }

    public String resolveToken(HttpServletRequest request){
        logger.info("[JwtTokenProvider] resolveToken, 헤더에서 토큰 값 추출");
        logger.info(request.getHeader("Content-Type"));
        return request.getHeader("Authorization");
    }

    public boolean validateToken(String token){
        // 토큰의 유효기간이 지나지 않았는지를 체크한다.
        logger.info("[JwtTokenProvider] validateToken, 토큰 유효성 체크");
        try{
            Jws<Claims> claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return !claims.getBody().getExpiration().before(new Date());
        } catch (Exception e){
            logger.info("[JwtTokenProvider] validateToken, 토큰 유효성 체크 예외 발생");
            return false;
        }

    }


}
