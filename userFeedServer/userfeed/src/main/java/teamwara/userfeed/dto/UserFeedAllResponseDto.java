package teamwara.userfeed.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserFeedResponseDto {
    private Long id;
    private String userFeedImage;
    private MemberDto memberDto;
    
    private String createdAt;
    private String modifiedAt;

}
