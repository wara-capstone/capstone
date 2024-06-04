package teamwara.userfeed.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import lombok.Getter;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.EntityListeners;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@ToString
public class Timestamped {

    // 생성 날짜 및 시간
    @CreatedDate
    @Column(updatable = false)// 데이터베이스에서 업데이트 불가능
    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")// JSON으로 직렬화할 때의 형식과 시간대를 지정
    private LocalDateTime createdDate;

    // 마지막 수정 날짜 및 시간
    @LastModifiedDate
    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss", timezone="Asia/Seoul")// JSON으로 직렬화할 때의 형식과 시간대를 지정
    private LocalDateTime modifiedDate;

    public void setModifiedAt(LocalDateTime localDateTime) {
        this.modifiedDate = localDateTime;
    }
}
