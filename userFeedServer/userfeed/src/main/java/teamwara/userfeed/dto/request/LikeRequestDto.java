package teamwara.userfeed.dto.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikeRequestDto {
    private String userEmail;
    private Long userFeedId;
}
