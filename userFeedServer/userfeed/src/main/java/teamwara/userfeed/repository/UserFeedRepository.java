package teamwara.userfeed.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import teamwara.userfeed.entity.Member;
import teamwara.userfeed.entity.UserFeed;

import java.util.List;
import java.util.Optional;

public interface UserFeedRepository extends JpaRepository<UserFeed,Long> {
    // ID와 이메일을 조합하여 특정 사용자 피드를 조회
    Optional<UserFeed> findByIdAndMemberUserEmail(Long id, String email);

    // 특정 이메일을 가진 사용자의 모든 피드를 조회
    List<UserFeed> findByMemberUserEmail(String email);
}
