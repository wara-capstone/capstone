package teamwara.userfeed.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import teamwara.userfeed.entity.Member;
import teamwara.userfeed.entity.UserFeed;

import java.util.Optional;

public interface UserFeedRepository extends JpaRepository<UserFeed,Long> {
}
