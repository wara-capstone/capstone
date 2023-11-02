package wara.product.DTO;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;


@Getter
@Setter
@RequiredArgsConstructor(staticName = "of")
public class ResponseDTO<T> {

    private final HttpStatus status;
    private final String message;
    private final T data;

}
