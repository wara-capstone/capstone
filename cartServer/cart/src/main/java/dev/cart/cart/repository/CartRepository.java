package dev.cart.cart.repository;

import dev.cart.cart.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {
    public Optional<CartEntity> findByEmail(String email);
    public Boolean existsByEmail(String email);
    public void deleteByEmail(String email);
}
