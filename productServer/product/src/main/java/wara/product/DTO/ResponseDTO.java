package wara.product.DTO;

import lombok.*;
import org.springframework.http.HttpStatus;


@Getter
@Setter
@RequiredArgsConstructor(staticName = "of")
public class ResponseDTO<T> {
    private final HttpStatus status;
    private final T data;

}
