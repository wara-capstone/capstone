package teamwara.userfeed.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import teamwara.userfeed.dto.UserDto;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WebClientService {
    private final WebClient userServiceWebClient;
    private final WebClient imageServiceWebClient;
    public Mono<UserDto> fetchMemberInfoByEmail(String email) {
        String url = "/api/user?email=" + email;
        return userServiceWebClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(UserApiResponse.class)
                .map(response -> new UserDto(response.getProfileImage(), response.getNickname()));
    }

    public Mono<String> uploadImage(MultipartFile imageFile) {
        if (imageFile.isEmpty()) {
            return Mono.error(new RuntimeException("파일이 비어 있습니다."));
        }
        return imageServiceWebClient.post()
                .uri("/api/image/upload")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData("images", imageFile.getResource()))
                .retrieve()
                .bodyToMono(ImageUploadResponse.class)
                .map(response -> response.getImages().get(0)); // Assuming 'images' is a list of image paths
    }


    @Getter
    static class ImageUploadResponse {
        private String result;
        private List<String> images;
    }


    @Getter
    static class UserApiResponse {
        private Long id;
        private String name;
        private String email;
        private String nickname;
        private String phone;
        private String profileImage;
    }
}
