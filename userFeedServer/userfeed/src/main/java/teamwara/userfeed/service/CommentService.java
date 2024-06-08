package teamwara.userfeed.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import teamwara.userfeed.dto.*;
import teamwara.userfeed.dto.request.CommentRequestDto;
import teamwara.userfeed.dto.request.UserFeedCommentRequestDto;
import teamwara.userfeed.dto.response.UserFeedDetailResponseDto;
import teamwara.userfeed.entity.Comment;
import teamwara.userfeed.entity.Member;
import teamwara.userfeed.entity.UserFeed;
import teamwara.userfeed.repository.CommentRepository;
import teamwara.userfeed.repository.LikeRepository;
import teamwara.userfeed.repository.MemberRepository;
import teamwara.userfeed.repository.UserFeedRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {
    private final UserFeedRepository userFeedRepository;
    private final MemberRepository memberRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final WebClientService webClientService;
    @Transactional
    public UserFeedDetailResponseDto createComment(UserFeedCommentRequestDto userFeedCommentRequestDto){
        // 회원 정보 조회 또는 생성
        Member member = memberRepository.findByUserEmail(userFeedCommentRequestDto.getUserEmail())
                .orElseGet(() -> {
                    Member newMember = new Member(userFeedCommentRequestDto.getUserEmail());
                    return memberRepository.save(newMember);
                });

        Optional<UserFeed> userFeedOptional = userFeedRepository.findById(userFeedCommentRequestDto.getUserFeedId());
        UserFeed userFeed = userFeedOptional.get();
        // UserFeed 생성 및 제품 리스트 연결
        Comment comment = Comment.builder()
                .content(userFeedCommentRequestDto.getContent())
                .member(member)
                .userFeed(userFeed)
                .build();

        commentRepository.save(comment);

        return convertToUserFeedDetailResponseDto(userFeed);
    }


    private UserFeedDetailResponseDto convertToUserFeedDetailResponseDto(UserFeed userFeed) {
        List<ProductDto> productDtos = userFeed.getProducts().stream()
                .map(product -> new ProductDto(product.getProductId(), product.getProductImage(),
                        product.getProductName(), product.getProductPrice()))
                .toList();

        UserDto userDto = webClientService.fetchMemberInfoByEmail(userFeed.getMember().getUserEmail()).block();

        List<CommentRequestDto> commentDtos = new ArrayList<>();
        if (userFeed.getComments() != null) {
            for (Comment comment : userFeed.getComments()) {
                UserDto commentUserDto = webClientService.fetchMemberInfoByEmail(comment.getMember().getUserEmail()).block();
                CommentRequestDto commentDto = new CommentRequestDto(
                        commentUserDto.getUserName(),
                        comment.getContent(),
                        comment.getCreatedDate().toString(),
                        comment.getModifiedDate().toString());
                commentDtos.add(commentDto);
            }
        }

        int likesCount = likeRepository.countByUserFeedId(userFeed.getId());
        Long memberId = userFeed.getMember().getId();
        boolean likedByMe = likeRepository.existsByUserFeedIdAndMemberId(userFeed.getId(), memberId);

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
