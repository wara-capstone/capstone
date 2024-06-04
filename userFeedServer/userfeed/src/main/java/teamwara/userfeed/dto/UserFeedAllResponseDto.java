package teamwara.userfeed.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserFeedAllResponseDto {
    private Long id;
    private String userFeedImage;
    private String userFeedContent;
    private UserDto user;
    private int likesCount;
    private boolean likedByMe;
    private String createdAt;
    private String modifiedAt;
}
