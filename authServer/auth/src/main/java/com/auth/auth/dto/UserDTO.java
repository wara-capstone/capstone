package com.auth.auth.dto;


import lombok.*;


// User Data Transfer Object
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@Builder
public class UserDTO {
    private String email;
    private String password;
    private String nickname;
    private String name;
    private String phone;
    private String role;

}
