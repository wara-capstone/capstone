package com.payment.Service;

import java.net.URISyntaxException;

public interface HttpCommunicationService {
    public Boolean stockUpdate(Long productId, Long optionId, Long count) throws URISyntaxException;
}
