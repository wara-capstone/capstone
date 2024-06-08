package teamwara.userfeed.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import teamwara.userfeed.dto.LikeDto;
import teamwara.userfeed.dto.LikeResponseDto;
import teamwara.userfeed.entity.Member;
import teamwara.userfeed.entity.UserFeed;
import teamwara.userfeed.entity.UserFeedLike;
import teamwara.userfeed.repository.LikeRepository;
import teamwara.userfeed.repository.MemberRepository;
import teamwara.userfeed.repository.UserFeedRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LikeService {
    private final UserFeedRepository userFeedRepository;
    private final MemberRepository memberRepository;
    private final LikeRepository likeRepository;
    @Transactional
    public LikeResponseDto toggleLike(LikeDto likeDto) {
        Member member = memberRepository.findByUserEmail(likeDto.getUserEmail())
                // 없으면 유저 생성
                .orElseGet(() -> {
                    Member newMember = new Member(likeDto.getUserEmail());
                    return memberRepository.save(newMember);
                });

        Optional<UserFeed> optionalUserFeed = userFeedRepository.findById(likeDto.getUserFeedId());
        if (!optionalUserFeed.isPresent()) {
            throw new IllegalArgumentException("UserFeed with ID " + likeDto.getUserFeedId() + " not found");
        }
        UserFeed userFeed = optionalUserFeed.get();

        if (likeRepository.existsByMember_UserEmailAndUserFeedId(likeDto.getUserEmail(), likeDto.getUserFeedId())) {
            likeRepository.deleteByMember_UserEmailAndUserFeedId(likeDto.getUserEmail(), likeDto.getUserFeedId());
            userFeed.decreaseLikes();  // 좋아요 제거 시 좋아요 수 감소
        } else {
            UserFeedLike newLike = UserFeedLike.builder()
                    .userFeed(userFeed)
                    .member(member)
                    .build();
            likeRepository.save(newLike);
            userFeed.increaseLikes();  // 좋아요 추가 시 좋아요 수 증가
        }


        boolean likedByMe = likeRepository.existsByMember_UserEmailAndUserFeedId(likeDto.getUserEmail(), userFeed.getId());


        return new LikeResponseDto(userFeed.getLikesCount(),likedByMe);
    }

}
