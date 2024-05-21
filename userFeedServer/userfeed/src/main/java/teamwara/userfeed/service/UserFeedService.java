package teamwara.userfeed.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
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
public class UserFeedService {
    private final UserFeedRepository userFeedRepository;
    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;
    private final WebClient webClient;

    public List<UserFeedAllResponseDto> getUserFeeds() {
        return userFeedRepository.findAll().stream()
                .map(this::convertToDto)
                .toList();
    }
    public UserFeedDetailResponseDto createUserFeed(UserFeedRequestDto userFeedRequestDto, MultipartFile imageFile) throws IOException {
        String imageFilename = UUID.randomUUID().toString() + "-" + imageFile.getOriginalFilename();
        Path targetLocation = Paths.get("/Users/iminjae/minjae worksapce/ON-OFF/userFeedServer/userfeed/src/main/resources/image/" + imageFilename);
        // 로컬 파일 시스템에 파일 저장
        Files.copy(imageFile.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        Member member = memberRepository.findByUserEmail(userFeedRequestDto.getUser().getUserEmail())
                .orElseGet(() -> {
                    Member newMember = new Member(userFeedRequestDto.getUser().getUserEmail());
                    return memberRepository.save(newMember);
                });

        List<Product> products = userFeedRequestDto.getProduct().stream().map(productDto ->
                Product.builder()
                        .productImage(productDto.getProductImage())
                        .productName(productDto.getProductName())
                        .productPrice(productDto.getProductPrice())
                        .build()
        ).toList();

        // UserFeed 생성 및 제품 리스트 연결
        UserFeed userFeed = UserFeed.builder()
                .userFeedImage(targetLocation.toString())
                .member(member)
                .products(products) // 제품 리스트 추가
                .build();

        // 각 제품에 UserFeed 설정
        products.forEach(product -> product.setUserFeed(userFeed));

        userFeedRepository.save(userFeed);
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

        UserDto userDto = fetchMemberInfoByEmail(userFeed.getMember().getUserEmail(),"Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJxcXFxQG5hdmVyLmNvbSIsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3MTYxOTQ1MDIsImV4cCI6MTcxNjE5ODEwMn0.OzPdjjegSY2t5pHAFs7-tP4y3O8rerS5_z0CMEWdvMk").block();

        return new UserFeedDetailResponseDto(
                userFeed.getUserFeedImage(),
                userDto,
                productDtos
        );
    }

    private UserFeedAllResponseDto convertToDto(UserFeed userFeed) {
        String email = userFeed.getMember().getUserEmail();
        UserDto userDto = fetchMemberInfoByEmail(email, "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJxcXFxQG5hdmVyLmNvbSIsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3MTYxOTQ1MDIsImV4cCI6MTcxNjE5ODEwMn0.OzPdjjegSY2t5pHAFs7-tP4y3O8rerS5_z0CMEWdvMk").block();  // 비동기 결과를 동기적으로 변환

        return new UserFeedAllResponseDto(
                userFeed.getId(),
                userFeed.getUserFeedImage(),
                userDto,
                userFeed.getCreatedAt().toString(),
                userFeed.getModifiedAt().toString()
        );
    }

    private Mono<UserDto> fetchMemberInfoByEmail(String email, String token) {
        String url = "/api/user?email=" + email;
        return webClient.get()
                .uri(url)
                .header("Authorization",token)
                .retrieve()
                .bodyToMono(UserApiResponse.class)
                .map(response -> new UserDto(response.getProfileImage(), response.getName()));
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
