package teamwara.userfeed.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import teamwara.userfeed.dto.UserFeedCommentRequestDto;
import teamwara.userfeed.service.CommentService;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("api/user-feed")
public class CommentController {
    private final CommentService createComment;
    @PostMapping("/comment")
    public ResponseEntity<?> createComment(@RequestBody UserFeedCommentRequestDto userFeedCommentRequestDto){
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(createComment.createComment(userFeedCommentRequestDto));
        } catch (Exception e) {
            log.error("Error creating comment", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }
}
