package com.auth.auth.repository;


import com.auth.auth.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Jpa repository 구현체
 */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    public UserEntity getByEmail(String email);
    public Optional<UserEntity> findByEmail(String email);
    public boolean existsByEmail(String email);
}
