package teamwara.userfeed.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequestDto {
    private String userName;
    private String content;
    private String createdAt;
    private String modifiedAt;
}
