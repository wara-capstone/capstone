package teamwara.userfeed.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import teamwara.userfeed.entity.Member;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member,Long> {
    Optional<Member> findByUserEmail(String email);
}
