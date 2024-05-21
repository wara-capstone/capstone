package teamwara.userfeed.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class UserFeed extends Timestamped{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_feed_id")
    private Long id;

    @Column(nullable = false)
    private String userFeedImage;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name="member_id")
    private Member member;

    @OneToMany(mappedBy = "userFeed",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products = new ArrayList<>();
    public void addProduct(Product product) {
        products.add(product);
        product.setUserFeed(this);
    }

    public void removeProduct(Product product) {
        products.remove(product);
        product.setUserFeed(null);
    }
}
