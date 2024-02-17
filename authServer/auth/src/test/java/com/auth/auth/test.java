package com.auth.auth;

import org.junit.jupiter.api.*;

public class test {


    @BeforeEach
    public void beforeEach(){
        System.out.println("BeforeEach : 각 테스트 실행 전 실행");
    }

    @AfterEach
    public void afterEach(){
        System.out.println("AfterEach : 각 테스트 실행 후 실행");
    }

    @BeforeAll
    public static void beforeAll(){
        System.out.println("beforeAll : 전체 테스트 실행 전 실행");
    }

    @AfterAll
    public static void afterAll(){
        System.out.println("afterAll : 전체 테스트 실행 후 실행");
    }

    @Test
    @DisplayName("test1")
    public void test1(){
        System.out.println("test1 인스턴스 주소 : " + this);
    }

    @Test
    @DisplayName("test2")
    public void test2(){
        System.out.println("test2 인스턴스 주소 : " + this);
    }
}
