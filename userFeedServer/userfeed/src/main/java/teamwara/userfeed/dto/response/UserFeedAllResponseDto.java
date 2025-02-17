package teamwara.userfeed.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;
import teamwara.userfeed.dto.UserDto;

import java.util.List;

@Getter
@Setter
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
