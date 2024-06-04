package teamwara.userfeed.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import teamwara.userfeed.dto.UserFeedAllResponseDto;
import teamwara.userfeed.dto.UserFeedDetailResponseDto;
import teamwara.userfeed.dto.UserFeedRequestDto;
import teamwara.userfeed.service.UserFeedService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/user-feed")
public class UserFeedController {
    private final UserFeedService userFeedService;

    @GetMapping(value = "/{id}")
    public ResponseEntity<?> getDetailUserFeed(@PathVariable("id") Long id){
        try {
            return ResponseEntity.ok(userFeedService.getDetailUserFeed(id));
        }catch (Exception e){
            e.printStackTrace(); // 로그에 에러 스택 트레이스 출력
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping()
    public ResponseEntity<?> getUserFeeds() {
        try {
            return ResponseEntity.ok(userFeedService.getUserFeeds());
        }catch (Exception e){
            e.printStackTrace(); // 로그에 에러 스택 트레이스 출력
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }


    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createUserFeed(
            @RequestPart("image") MultipartFile imageFile,
            @RequestPart("userFeed") UserFeedRequestDto userFeedRequestDto) {
        try {
            UserFeedDetailResponseDto response = userFeedService.createUserFeed(userFeedRequestDto, imageFile);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // 로그에 에러 스택 트레이스 출력
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}