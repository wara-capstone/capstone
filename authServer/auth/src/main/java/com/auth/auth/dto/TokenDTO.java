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
    private String refreshToken;
    private String accessToken;
    private String email;
    private String role;
}
