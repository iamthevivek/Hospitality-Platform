package com.hospitality.controller;

import com.hospitality.dto.AiChatRequest;
import com.hospitality.dto.AiChatResponse;
import com.hospitality.dto.ApiResponse;
import com.hospitality.service.GroqAiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/ai")
@RequiredArgsConstructor
@Tag(name = "AI Concierge", description = "AI concierge assistant endpoints powered by Groq and LLaMA 3")
public class PublicAiController {

    private final GroqAiService groqAiService;

    @PostMapping("/chat")
    @Operation(summary = "Chat with AI Concierge", description = "Sends a message to the AI travel concierge and receives personalized travel advice")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(@RequestBody AiChatRequest request) {
        AiChatResponse response = groqAiService.chat(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
