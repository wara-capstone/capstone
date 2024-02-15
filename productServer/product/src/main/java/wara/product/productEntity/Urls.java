package wara.product.productEntity;


import lombok.*;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Embeddable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Embeddable
@ToString
@NoArgsConstructor
@Getter @Setter
public class Urls {

    @ElementCollection
    @Column(name = "productUrls")
    List<String> urls = new ArrayList<>();

    public Urls(List<String> urls) {
        this.urls = urls;
    }
}
