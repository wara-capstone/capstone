package com.store.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class CoordinateDTO {
    Double minX;
    Double maxX;
    Double minY;
    Double maxY;
}
