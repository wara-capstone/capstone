package teamwara.userfeed.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import teamwara.userfeed.entity.UserFeed;

public interface UserFeedRepository extends JpaRepository<UserFeed,Long> {
}
