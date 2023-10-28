//package com.auth.auth.service.impl;
//
//
//import com.auth.auth.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//
//// 유저 디테일 서비스를 구현한 클래스
//// ID를 이용해 사용자 정보를 가져온다.
//@RequiredArgsConstructor
//@Service
//public class UserDetailsServiceImpl implements UserDetailsService {
//
//    private final static Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);
//    private final UserRepository userRepository;
//
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        logger.info("[UserDetailsService Impl] loadUserByUsername, username : ", username);
//        return userRepository.getByEmail(username);
//    }
//}
