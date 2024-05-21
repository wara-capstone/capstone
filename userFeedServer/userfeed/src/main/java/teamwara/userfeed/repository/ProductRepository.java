package teamwara.userfeed.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import teamwara.userfeed.entity.Product;

public interface ProductRepository extends JpaRepository<Product,Long> {
}
