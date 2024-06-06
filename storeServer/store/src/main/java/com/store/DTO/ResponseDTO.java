package com.store.DTO;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ResponseDTO {
    private String result;
    private Object data;
}
