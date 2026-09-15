package com.seal.hackathon.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.ai")
public class AiConfigurationProperties {
    /**
     * Bật hoặc tắt tính năng gọi AI trực tiếp.
     */
    private boolean enabled = false;

    /**
     * Khóa bí mật API đọc từ biến môi trường (AI_API_KEY).
     */
    private String apiKey = "";

    /**
     * Tên mô hình LLM sử dụng (mặc định gemini-1.5-flash hoặc gpt-4o-mini).
     */
    private String model = "gemini-1.5-flash";

    /**
     * Endpoint API (OpenAI-compatible chat completion URL).
     */
    private String endpoint = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

    /**
     * Thời gian chờ tối đa khi gọi AI (mili-giây).
     */
    private int timeoutMs = 8000;
}
