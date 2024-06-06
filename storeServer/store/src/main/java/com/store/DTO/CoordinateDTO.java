package com.store.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class CoordinateDTO {
    private Double minX;
    private Double maxX;
    private Double minY;
    private Double maxY;
}
