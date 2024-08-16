package ssafy.age.backend.config;

import jakarta.servlet.MultipartConfigElement;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

public class MultipartConfig {

    @Value("${spring.servlet.multipart.max-request-size}")
    private long maxRequestSize;

    @Value("${spring.servlet.multipart.max-file-size}")
    private long maxFileSize;

    @Bean
    public MultipartResolver multipartResolver() {
        StandardServletMultipartResolver multipartResolver = new StandardServletMultipartResolver();
        return multipartResolver;
    }

    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setMaxRequestSize(DataSize.ofBytes(maxRequestSize));
        factory.setMaxFileSize(DataSize.ofBytes(maxFileSize));

        return factory.createMultipartConfig();
    }
}
