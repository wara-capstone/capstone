package com.wara.merchandise.repository;



import com.wara.merchandise.entity.MerchandiseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MerchandiseRepository extends JpaRepository<MerchandiseEntity, String>
{
    MerchandiseEntity getByItemId(String id);
    List<MerchandiseEntity> getAllByCategory(String condition);
    List<MerchandiseEntity> getAll();
}
