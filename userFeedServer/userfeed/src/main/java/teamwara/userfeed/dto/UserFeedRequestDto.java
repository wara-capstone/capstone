package teamwara.userfeed.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserFeedRequestDto {
    private MemberDto user;
    private List<ProductDto> product;
}
