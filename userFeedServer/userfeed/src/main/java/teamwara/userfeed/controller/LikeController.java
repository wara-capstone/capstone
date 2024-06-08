package teamwara.userfeed.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import teamwara.userfeed.dto.request.LikeRequestDto;
import teamwara.userfeed.service.LikeService;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("api/user-feed")
public class LikeController {
    public final LikeService likeService;
    @PostMapping("/like/toggle")
    public ResponseEntity<?> toggleLike(@RequestBody LikeRequestDto likeDto) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(likeService.toggleLike(likeDto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to toggle like: " + e.getMessage());
        }
    }
}
