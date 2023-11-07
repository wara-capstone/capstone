package dev.cart.cart.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cart")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Long id;

    @Column
    private String email;

    @Column
    @OneToMany(mappedBy = "cart", cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<ProductInfoEntity> productInfoEntities = new ArrayList<>();

}
