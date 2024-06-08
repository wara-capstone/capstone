package teamwara.userfeed.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import teamwara.userfeed.dto.MemberDto;
import teamwara.userfeed.dto.ProductDto;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserFeedRequestDto {
    private MemberDto user;
    private String userFeedContent;
    private List<ProductDto> product;
}
