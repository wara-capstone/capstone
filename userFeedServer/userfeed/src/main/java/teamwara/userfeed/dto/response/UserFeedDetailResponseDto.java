package teamwara.userfeed.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import teamwara.userfeed.dto.ProductDto;
import teamwara.userfeed.dto.UserDto;
import teamwara.userfeed.dto.request.CommentRequestDto;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserFeedDetailResponseDto {
    private String userFeedImage;
    private String userFeedContent;
    private UserDto user;
    private int likesCount;
    private boolean likedByMe;
    private List<ProductDto> product;
    private List<CommentRequestDto> comments;
}
