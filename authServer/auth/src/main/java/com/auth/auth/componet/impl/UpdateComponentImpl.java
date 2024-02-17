package com.auth.auth.componet.impl;

import com.auth.auth.componet.UpdateComponent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;

@Component
public class UpdateComponentImpl implements UpdateComponent {
    private final static Logger logger = LoggerFactory.getLogger(UpdateComponent.class);

    @Override
    public <T> T update(T before, T after, Class<T> type) {

        try {
            T updatedObject = type.getDeclaredConstructor().newInstance();

            // 클래스의 모든 필드를 가져와 비교
            for (Field field : type.getDeclaredFields()) {
                field.setAccessible(true);
                Object beforeValue = field.get(before);
                Object afterValue = field.get(after);

                // 값이 다르면 새로운 객체에 반영
                if (!isEqual(beforeValue, afterValue)) {
                    field.set(updatedObject, afterValue);
                }else{
                    field.set(updatedObject, beforeValue);
                }
            }

            return updatedObject;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    private boolean isEqual(Object obj1, Object obj2) {
        return (obj1 == null && obj2 == null) || (obj1 != null && obj1.equals(obj2));
    }

}
