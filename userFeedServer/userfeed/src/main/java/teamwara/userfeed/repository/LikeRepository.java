package teamwara.userfeed.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import teamwara.userfeed.entity.UserFeedLike;

public interface LikeRepository extends JpaRepository<UserFeedLike,Long> {
    boolean existsByUserFeedIdAndMemberId(Long userFeedId, Long memberId);
    int countByUserFeedId(Long userFeedId);

    boolean existsByMember_UserEmailAndUserFeedId(String memberId, Long userFeedId);
    void deleteByMember_UserEmailAndUserFeedId(String memberId, Long userFeedId);
}
