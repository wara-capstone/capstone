package teamwara.userfeed.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import teamwara.userfeed.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment,Long> {

}
