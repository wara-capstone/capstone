package teamwara.userfeed.controller;

import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import teamwara.userfeed.dto.UserFeedDto;
import teamwara.userfeed.service.UserFeedService;

@RestController
@RequestMapping("api/user-feed")
@RequiredArgsConstructor
public class UserFeedGetController {
    private final UserFeedService userFeedService;
    @GetMapping(value = "/")
    public List<UserFeedDto> getUserFeeds(){

    }
}
