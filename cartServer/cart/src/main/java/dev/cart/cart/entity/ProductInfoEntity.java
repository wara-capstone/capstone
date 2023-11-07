package dev.cart.cart.entity;

import lombok.*;

import javax.persistence.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "product_info")
public class ProductInfoEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "info_id")
    private Long id;

    @Column
    private Long productId;
    @Column
    private Long storeId;
    @Column
    private Long quantity;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private CartEntity cart;

}
