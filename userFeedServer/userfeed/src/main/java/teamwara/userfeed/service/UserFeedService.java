package teamwara.userfeed.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import teamwara.userfeed.dto.*;
import teamwara.userfeed.entity.Member;
import teamwara.userfeed.entity.Product;
import teamwara.userfeed.entity.UserFeed;
import teamwara.userfeed.repository.MemberRepository;
import teamwara.userfeed.repository.ProductRepository;
import teamwara.userfeed.repository.UserFeedRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserFeedService {
    private final UserFeedRepository userFeedRepository;
    private final MemberRepository memberRepository;
    private final WebClient userServiceWebClient;
    private final WebClient imageServiceWebClient;

    public List<UserFeedAllResponseDto> getUserFeeds() {
        return userFeedRepository.findAll().stream()
                .map(this::convertToDto)
                .toList();
    }

    @Transactional
    public UserFeedDetailResponseDto createUserFeed(UserFeedRequestDto userFeedRequestDto, MultipartFile imageFile) throws IOException {

        // 회원 정보 조회 또는 생성
        Member member = memberRepository.findByUserEmail(userFeedRequestDto.getUser().getUserEmail())
                .orElseGet(() -> {
                    Member newMember = new Member(userFeedRequestDto.getUser().getUserEmail());
                    return memberRepository.save(newMember);
                });

        // 제품 정보 생성
        List<Product> products = userFeedRequestDto.getProduct().stream().map(productDto ->
                Product.builder()
                        .productImage(productDto.getProductImage())
                        .productName(productDto.getProductName())
                        .productPrice(productDto.getProductPrice())
                        .build()
        ).toList();

        // UserFeed 생성 및 제품 리스트 연결
        String userFeedImagePath = uploadImage(imageFile).block();

        // UserFeed 생성 및 제품 리스트 연결
        UserFeed userFeed = UserFeed.builder()
                .userFeedImage(userFeedImagePath) // 저장된 이미지 경로를 DB에 저장
                .member(member)
                .products(products)
                .build();

        // 각 제품에 UserFeed 설정
        products.forEach(product -> product.setUserFeed(userFeed));

        // UserFeed 저장
        userFeedRepository.save(userFeed);

        // Response 반환, URL을 포함시키는 것을 고려
        return convertToUserFeedDetailResponseDto(userFeed);
    }

    public UserFeedDetailResponseDto getDetailUserFeed(Long id){
        Optional<UserFeed> optionalUserFeed = userFeedRepository.findById(id);
        UserFeed userFeed = optionalUserFeed.get();
        return convertToUserFeedDetailResponseDto(userFeed);
    }

    private UserFeedDetailResponseDto convertToUserFeedDetailResponseDto(UserFeed userFeed) {
        List<ProductDto> productDtos = userFeed.getProducts().stream()
                .map(product -> new ProductDto(product.getProductImage(),
                        product.getProductName(), product.getProductPrice()))
                .toList();

        UserDto userDto = fetchMemberInfoByEmail(userFeed.getMember().getUserEmail()).block();

        return new UserFeedDetailResponseDto(
                userFeed.getUserFeedImage(),
                userDto,
                productDtos
        );
    }

    private UserFeedAllResponseDto convertToDto(UserFeed userFeed) {
        String email = userFeed.getMember().getUserEmail();
        UserDto userDto = fetchMemberInfoByEmail(email).block();  // 비동기 결과를 동기적으로 변환

        return new UserFeedAllResponseDto(
                userFeed.getId(),
                userFeed.getUserFeedImage(),
                userDto,
                userFeed.getCreatedAt().toString(),
                userFeed.getModifiedAt().toString()
        );
    }

    private Mono<UserDto> fetchMemberInfoByEmail(String email) {
        String url = "/api/user?email=" + email;
        return userServiceWebClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(UserApiResponse.class)
                .map(response -> new UserDto(response.getProfileImage(), response.getName()));
    }

    private Mono<String> uploadImage(MultipartFile imageFile) {
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
