package teamwara.userfeed.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import teamwara.userfeed.dto.*;
import teamwara.userfeed.repository.LikeRepository;
import teamwara.userfeed.service.UserFeedService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("api/user-feed")
public class UserFeedController {
    private final UserFeedService userFeedService;
    @GetMapping("/{id}")
    public ResponseEntity<?> getDetailUserFeed(@PathVariable("id") Long id, @RequestParam(required = false) String email) {
        try {
            UserFeedDetailResponseDto response = userFeedService.getDetailUserFeed(id, email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error retrieving user feed details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping()
    public ResponseEntity<?> getUserFeeds(@RequestParam(required = false) String email) {
        try {
            List<UserFeedAllResponseDto> feeds = userFeedService.getUserFeeds(email);
            return ResponseEntity.ok(feeds);
        } catch (Exception e) {
            log.error("Error retrieving user feeds", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createUserFeed(
            @RequestPart("image") MultipartFile imageFile,
            @RequestPart("userFeed") UserFeedRequestDto userFeedRequestDto) {
        try {
            UserFeedDetailResponseDto response = userFeedService.createUserFeed(userFeedRequestDto, imageFile);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(response);
        } catch (Exception e) {
            log.error("Error creating user feed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }



}