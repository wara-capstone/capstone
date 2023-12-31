package com.auth.auth.aspect;

import com.auth.auth.except.NullDTOException;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuthAspect {
    private static final Logger logger = LoggerFactory.getLogger(AuthAspect.class);

    @Around("execution(* com.auth.auth.service.impl.AuthServiceImpl.*(com.auth.auth.dto.UserDTO))")
    public Object nullPointExceptionAspect(ProceedingJoinPoint joinPoint) throws Throwable {
        logger.info("["+joinPoint.getSignature().toShortString()+"]이 실행되었습니다.");
        try{
            return joinPoint.proceed();
            // DataIntegrityViolatingException은 email이 null일 경우 발생
        }catch (NullPointerException | DataIntegrityViolationException e){
            throw new NullDTOException();
        }finally {
            logger.info("["+joinPoint.getSignature().toShortString()+"]이 종료되었습니다.");
        }
    }



}
