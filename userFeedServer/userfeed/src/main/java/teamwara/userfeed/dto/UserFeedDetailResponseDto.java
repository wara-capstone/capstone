package teamwara.userfeed.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserFeedDetailResponseDto {
    private String userFeedImage;
    private UserDto user;
    private List<ProductDto> product;
}
