package teamwara.userfeed.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import teamwara.userfeed.entity.UserFeedLike;

public interface LikeRepository extends JpaRepository<UserFeedLike, Long> {
    boolean existsByUserFeedIdAndMemberId(Long userFeedId, Long memberId);
    int countByUserFeedId(Long userFeedId);

    // 특정 사용자 이메일과 UserFeedId를 기반으로 좋아요 존재 여부 확인
    boolean existsByMember_UserEmailAndUserFeedId(String email, Long userFeedId);

    // 특정 사용자 이메일과 UserFeedId를 기반으로 좋아요 삭제
    void deleteByMember_UserEmailAndUserFeedId(String email, Long userFeedId);
}
