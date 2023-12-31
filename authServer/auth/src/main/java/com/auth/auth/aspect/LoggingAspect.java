package com.auth.auth.aspect;


import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Objects;

@Aspect
@Component
public class LoggingAspect {
    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Around("execution(* com.auth.auth.dao.impl.UserDAOImpl.*(..))")
    public Object beforeServiceMethod(ProceedingJoinPoint joinPoint) {
        logger.info("["+joinPoint.getSignature().toShortString()+"]이 실행되었습니다.");
        logger.info("================Args================");
        logger.info(Arrays.toString(joinPoint.getArgs()));
        logger.info("====================================");
        try {
            return joinPoint.proceed();
        } catch (Throwable e) {
            throw new RuntimeException(e);
        }finally {
            logger.info("["+joinPoint.getSignature().toShortString()+"]이 종료되었습니다.");
        }
    }
}
