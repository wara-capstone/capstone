package com.store.Service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URISyntaxException;

public interface HttpCommunicationService {
    public Boolean productDelete(Long storeId) throws URISyntaxException;
    public String imageUpload(MultipartFile image) throws URISyntaxException, IOException;
    public String imageUpdate(MultipartFile image, String imageKey) throws URISyntaxException, IOException;
    public Boolean imageDelete(String imageKey) throws URISyntaxException;
}
