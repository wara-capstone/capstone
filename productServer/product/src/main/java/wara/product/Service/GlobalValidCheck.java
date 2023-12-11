package wara.product.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
//import org.springframework.validation.Validator;
import javax.validation.Validator;
import javax.validation.ConstraintViolation;
import java.util.Set;


@Component
public class GlobalValidCheck<T> {
    private final Validator validator;

    public GlobalValidCheck(@Autowired Validator validator) {
        this.validator = validator;
    }

    public String validCheck(T t)
    {
        // 유효성 검사 이후 발생한 모든 violations(위반)내용을 violations변수에 저장함
        Set<ConstraintViolation<T>> violations = validator.validate(t);

        if (violations.isEmpty()) {// 오류 내용이 없다면 성공
            return "success";
        } else
        {  // 오류 내용이 있다면 errorMessage에 저장하고 출력
            StringBuilder errorMessage = new StringBuilder();
            for (ConstraintViolation<T> violation : violations) {
                errorMessage.append(violation.getPropertyPath()).append(" : ").append(violation.getMessage()).append("\n");
            }
            return errorMessage.toString();
        }
    }
}
