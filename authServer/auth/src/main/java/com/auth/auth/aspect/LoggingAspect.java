package com.auth.auth.aspect;


import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
public class LoggingAspect {
    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Before("execution(* com.auth.auth.dao.impl.UserDAOImpl.*(..))")
    public void beforeServiceMethod(JoinPoint joinPoint) {
        logger.info("["+joinPoint.getSignature().toShortString()+"]이 실행되었습니다.");
        logger.info("================Args================");
        logger.info(Arrays.toString(joinPoint.getArgs()));
        logger.info("====================================");
    }
}
