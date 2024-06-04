package teamwara.userfeed.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserFeedCommentRequestDto {
    private Long userFeedId;
    private String userEmail;
    private String content;
}
