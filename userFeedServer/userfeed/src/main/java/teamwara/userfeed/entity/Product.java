package teamwara.userfeed.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Product extends Timestamped {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="p_id")
    private Long id;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String productImage;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private String productPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_feed_id")
    private UserFeed userFeed;

    // userFeed 설정 메서드
    public void setUserFeed(UserFeed userFeed) {
        this.userFeed = userFeed;
    }
}