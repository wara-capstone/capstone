package com.payment.Config;

import com.siot.IamportRestClient.IamportClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    String apiKey = "5228767438010567";
    String secretKey = "vvU0AV12e86EGxoKa8xJAxYY76DxsaOor5PzqvfKlg4GSbDB7feZ8RHtKAhjcTVbZMa2vBFGIERiDfoO";

    @Bean
    public IamportClient iamportClient() {
        return new IamportClient(apiKey, secretKey);
    }
}
