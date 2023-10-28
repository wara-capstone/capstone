package com.auth.auth.dto;


import lombok.*;

// Token Data Transfer Object
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
@Builder
public class TokenDTO {
    private String token;
    private String email;
    private String role;
}
