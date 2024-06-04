package teamwara.userfeed.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    private String userName;
    private String content;
    private String createdAt;
    private String modifiedAt;
}
