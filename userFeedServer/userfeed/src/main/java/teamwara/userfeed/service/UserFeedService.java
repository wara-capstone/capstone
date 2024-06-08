package teamwara.userfeed.service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import teamwara.userfeed.dto.*;
import teamwara.userfeed.dto.request.CommentRequestDto;
import teamwara.userfeed.dto.request.UserFeedRequestDto;
import teamwara.userfeed.dto.response.UserFeedAllResponseDto;
import teamwara.userfeed.dto.response.UserFeedDetailResponseDto;
import teamwara.userfeed.entity.*;
import teamwara.userfeed.repository.*;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserFeedService {
    private final UserFeedRepository userFeedRepository;
    private final MemberRepository memberRepository;
    private final LikeRepository likeRepository;
    private final WebClientService webClientService;

    public UserFeedDetailResponseDto getDetailUserFeed(Long id, String email) {
        UserFeed userFeed = userFeedRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User feed not found"));
        boolean likedByMe = email != null && likeRepository.existsByMember_UserEmailAndUserFeedId(email, userFeed.getId());
        return convertToUserFeedDetailResponseDto(userFeed, likedByMe);
    }

    public List<UserFeedAllResponseDto> getUserFeeds(String email) {
        List<UserFeed> userFeeds = userFeedRepository.findAll();
        return userFeeds.stream().map(feed -> {
            boolean likedByMe = email != null && !email.isEmpty() && likeRepository.existsByMember_UserEmailAndUserFeedId(email, feed.getId());
            return convertToUserFeedAllResponseDto(feed, likedByMe);
        }).toList();
    }

    @Transactional
    public UserFeedDetailResponseDto createUserFeed(UserFeedRequestDto userFeedRequestDto, MultipartFile imageFile) throws IOException {
        Member member = memberRepository.findByUserEmail(userFeedRequestDto.getUser().getUserEmail())
                .orElseGet(() -> memberRepository.save(new Member(userFeedRequestDto.getUser().getUserEmail())));

        List<Product> products = userFeedRequestDto.getProduct().stream()
                .map(productDto -> Product.builder()
                        .productId(productDto.getProductId())
                        .productImage(productDto.getProductImage())
                        .productName(productDto.getProductName())
                        .productPrice(productDto.getProductPrice())
                        .build())
                .toList();

        String userFeedImagePath = webClientService.uploadImage(imageFile).block();

        UserFeed userFeed = UserFeed.builder()
                .userFeedImage(userFeedImagePath)
                .userFeedContent(userFeedRequestDto.getUserFeedContent())
                .member(member)
                .products(products)
                .build();

        products.forEach(product -> product.setUserFeed(userFeed));
        userFeedRepository.save(userFeed);

        return convertToUserFeedDetailResponseDto(userFeed, false);  // Assume false initially, update later if needed
    }

    private UserFeedAllResponseDto convertToUserFeedAllResponseDto(UserFeed userFeed, boolean likedByMe) {
        UserDto userDto = webClientService.fetchMemberInfoByEmail(userFeed.getMember().getUserEmail()).block();  // Synchronously fetch user details
        int likesCount = likeRepository.countByUserFeedId(userFeed.getId());
        return new UserFeedAllResponseDto(
                userFeed.getId(),
                userFeed.getUserFeedImage(),
                userFeed.getUserFeedContent(),
                userDto,
                likesCount,
                likedByMe,
                userFeed.getCreatedDate().toString(),
                userFeed.getModifiedDate().toString()
        );
    }

    private UserFeedDetailResponseDto convertToUserFeedDetailResponseDto(UserFeed userFeed, boolean likedByMe) {
        List<ProductDto> productDtos = userFeed.getProducts().stream()
                .map(product -> new ProductDto(product.getProductId(), product.getProductImage(),
                        product.getProductName(), product.getProductPrice()))
                .toList();

        UserDto userDto = webClientService.fetchMemberInfoByEmail(userFeed.getMember().getUserEmail()).block();

        List<CommentRequestDto> commentDtos = userFeed.getComments().stream()
                .map(comment -> {
                    UserDto commentUserDto = webClientService.fetchMemberInfoByEmail(comment.getMember().getUserEmail()).block();
                    return new CommentRequestDto(
                            commentUserDto.getUserName(),
                            comment.getContent(),
                            comment.getCreatedDate().toString(),
                            comment.getModifiedDate().toString());
                })
                .toList();

        int likesCount = likeRepository.countByUserFeedId(userFeed.getId());

        return new UserFeedDetailResponseDto(
                userFeed.getUserFeedImage(),
                userFeed.getUserFeedContent(),
                userDto,
                likesCount,
                likedByMe,
                productDtos,
                commentDtos
        );
    }
}
