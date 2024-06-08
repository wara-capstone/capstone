package teamwara.userfeed.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import teamwara.userfeed.entity.Comment;

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
    private List<CommentDto> comments;
}
