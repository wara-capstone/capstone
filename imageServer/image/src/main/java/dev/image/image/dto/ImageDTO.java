package dev.image.image.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class ImageDTO {

    private String result;
    @Builder.Default
    private List<String> images = new ArrayList<>();
}
