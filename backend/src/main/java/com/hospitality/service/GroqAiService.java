package com.hospitality.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hospitality.dto.AiChatRequest;
import com.hospitality.dto.AiChatResponse;
import com.hospitality.entity.Hotel;
import com.hospitality.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GroqAiService {

    private final HotelRepository hotelRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Value("${groq.api.key:}")
    private String apiKey;

    @Value("${groq.model:openai/gpt-oss-120b}")
    private String model;

    @Value("${groq.api.url:https://api.groq.com/openai/v1/chat/completions}")
    private String apiUrl;

    public AiChatResponse chat(AiChatRequest request) {
        String userMessage = request.getMessage() != null ? request.getMessage().trim() : "";
        if (userMessage.isBlank()) {
            return AiChatResponse.builder()
                    .reply("Namaste! How may I assist your travel plans today? Ask me about our heritage palaces in Rajasthan, beach resorts in Goa, or 5-star properties across India and worldwide.")
                    .suggestedLink("/hotels")
                    .suggestedLinkText("Explore Hotels")
                    .modelUsed("stayease-assistant")
                    .build();
        }

        // 1. If Groq API Key is configured, attempt real LLM call
        if (apiKey != null && !apiKey.isBlank()) {
            try {
                return callGroqLlm(userMessage, request.getHistory(), model);
            } catch (Exception e) {
                log.warn("Groq API call with model {} failed: {}. Retrying with backup model...", model, e.getMessage());
                try {
                    return callGroqLlm(userMessage, request.getHistory(), "qwen/qwen3.8-27b");
                } catch (Exception e2) {
                    log.warn("Backup Groq model qwen3.8-27b failed: {}. Retrying with gpt-oss-20b...", e2.getMessage());
                    try {
                        return callGroqLlm(userMessage, request.getHistory(), "openai/gpt-oss-20b");
                    } catch (Exception e3) {
                        log.warn("All Groq models failed: {}. Falling back to internal engine.", e3.getMessage());
                    }
                }
            }
        } else {
            log.info("GROQ_API_KEY is not configured or empty. Using assistant engine.");
        }

        // 2. Fallback to built-in travel assistant engine
        return fallbackAssistantReply(userMessage);
    }

    private AiChatResponse callGroqLlm(String userMessage, List<AiChatRequest.ChatMessage> history, String modelToUse) throws Exception {
        String systemPrompt = buildSystemPrompt();

        ObjectNode rootNode = objectMapper.createObjectNode();
        rootNode.put("model", modelToUse != null ? modelToUse : "openai/gpt-oss-120b");
        rootNode.put("temperature", 0.7);
        rootNode.put("max_tokens", 1200);

        ArrayNode messagesArray = rootNode.putArray("messages");

        // System prompt
        ObjectNode systemMsg = messagesArray.addObject();
        systemMsg.put("role", "system");
        systemMsg.put("content", systemPrompt);

        // Previous conversation history (up to last 6 messages)
        if (history != null && !history.isEmpty()) {
            int start = Math.max(0, history.size() - 6);
            for (int i = start; i < history.size(); i++) {
                AiChatRequest.ChatMessage m = history.get(i);
                ObjectNode histMsg = messagesArray.addObject();
                histMsg.put("role", m.getRole());
                histMsg.put("content", m.getContent());
            }
        }

        // Current user message
        ObjectNode userMsg = messagesArray.addObject();
        userMsg.put("role", "user");
        userMsg.put("content", userMessage);

        String jsonPayload = objectMapper.writeValueAsString(rootNode);

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                .timeout(Duration.ofSeconds(20))
                .build();

        HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            log.warn("Groq API returned HTTP {}: {}", response.statusCode(), response.body());
            throw new RuntimeException("Groq API error: " + response.statusCode());
        }

        JsonNode resJson = objectMapper.readTree(response.body());
        String replyText = resJson.path("choices").path(0).path("message").path("content").asText();

        if (replyText == null || replyText.isBlank()) {
            replyText = resJson.path("choices").path(0).path("message").path("reasoning").asText();
        }

        if (replyText == null || replyText.isBlank()) {
            throw new RuntimeException("Empty response from Groq");
        }

        return linkifyResponse(replyText, userMessage, modelToUse != null ? modelToUse : "stayease-ai");
    }

    private String buildSystemPrompt() {
        StringBuilder sb = new StringBuilder();
        sb.append("You are the StayEase Travel Assistant, a friendly, courteous, and knowledgeable hotel booking assistant for StayEase (India's premier modern hospitality platform).\n");
        sb.append("You assist guests with discovering heritage royal palaces in Rajasthan, beach resorts in Goa, 5-star properties in Mumbai, Delhi, Chennai, and global getaways.\n\n");

        sb.append("LIVE HOTEL INVENTORY (All rates in Indian Rupees ₹ INR):\n");
        try {
            List<Hotel> hotels = hotelRepository.findAll();
            for (Hotel h : hotels) {
                sb.append(String.format("• %s (%s, %s) — 5-Star luxury, from ₹%s/night. Amenities: %s. Description: %s\n",
                        h.getName(), h.getCity(), h.getCountry(),
                        h.getPriceFrom() != null ? h.getPriceFrom().toPlainString() : "20,000",
                        h.getAmenities() != null ? h.getAmenities() : "WiFi, Pool, Spa, Dining",
                        h.getDescription() != null ? h.getDescription() : "Luxury stay"));
            }
        } catch (Exception e) {
            sb.append("• The Taj Mahal Palace, Mumbai, India (₹24,000/night)\n");
            sb.append("• Rambagh Palace, Jaipur, India (₹38,000/night)\n");
            sb.append("• Taj Exotica Resort & Spa, Goa, India (₹18,500/night)\n");
            sb.append("• The Leela Palace, New Delhi, India (₹22,000/night)\n");
            sb.append("• The Oberoi Udaivilas, Udaipur, India (₹42,000/night)\n");
            sb.append("• ITC Grand Chola, Chennai, India (₹14,000/night)\n");
        }

        sb.append("\nSTAYEASE POLICIES:\n");
        sb.append("1. Currency: All prices in Indian Rupees (₹ INR) with zero hidden fees.\n");
        sb.append("2. Payments: UPI (Google Pay, PhonePe, Paytm), RuPay, Visa, Mastercard, NetBanking.\n");
        sb.append("3. Cancellation: 100% full refund up to 48 hours before check-in.\n");
        sb.append("4. Check-in: 2:00 PM check-in, 11:00 AM check-out. Adult guests in India must present a valid government photo ID (Aadhaar, Passport, Driving License, Voter ID). PAN card not accepted.\n");
        sb.append("5. Support: 24/7 Guest Support: +91 (022) 4982-3000, WhatsApp: +91 98201 12345, Email: support@stayease.in.\n\n");

        sb.append("GUIDELINES:\n");
        sb.append("- Speak warmly and with graceful hospitality (use 'Namaste' where fitting).\n");
        sb.append("- Keep answers concise (2-4 brief paragraphs max) with clean Markdown formatting.\n");
        sb.append("- Mention property names and approximate prices in ₹ INR.\n");
        sb.append("- If asked about cancellations or payments, explain clearly and politely.\n");
        sb.append("- Do NOT output markdown code blocks for the whole text; just write natural text.\n");

        return sb.toString();
    }

    private AiChatResponse linkifyResponse(String replyText, String userQuery, String modelName) {
        String lower = (userQuery + " " + replyText).toLowerCase();
        String link = "/hotels";
        String linkText = "Explore All Hotels";

        if (lower.contains("mumbai")) {
            link = "/hotels?city=Mumbai";
            linkText = "View Mumbai Hotels";
        } else if (lower.contains("jaipur") || lower.contains("rambagh")) {
            link = "/hotels?city=Jaipur";
            linkText = "Explore Jaipur Palace";
        } else if (lower.contains("goa") || lower.contains("exotica")) {
            link = "/hotels?city=Goa";
            linkText = "View Goa Beach Resorts";
        } else if (lower.contains("delhi") || lower.contains("leela")) {
            link = "/hotels?city=New Delhi";
            linkText = "View Delhi Properties";
        } else if (lower.contains("udaipur") || lower.contains("udaivilas")) {
            link = "/hotels?city=Udaipur";
            linkText = "View Udaipur Palaces";
        } else if (lower.contains("chennai") || lower.contains("chola")) {
            link = "/hotels?city=Chennai";
            linkText = "View Chennai Hotels";
        } else if (lower.contains("cancel") || lower.contains("refund")) {
            link = "/cancellation-policy";
            linkText = "View Cancellation Policy";
        } else if (lower.contains("contact") || lower.contains("phone")) {
            link = "/contact";
            linkText = "Contact Support";
        }

        return AiChatResponse.builder()
                .reply(replyText)
                .suggestedLink(link)
                .suggestedLinkText(linkText)
                .modelUsed("stayease-assistant")
                .build();
    }

    private AiChatResponse fallbackAssistantReply(String query) {
        String q = query.toLowerCase();

        if (q.contains("how are you") || q.contains("how r u") || q.contains("how do you do") || q.contains("how's it going")) {
            return AiChatResponse.builder()
                    .reply("I'm doing wonderful, thank you for asking! 😊\n\nI'm your StayEase Travel Assistant. I can help you discover luxury heritage palaces in Rajasthan, private beach retreats in Goa, or 5-star hotels worldwide. I can also assist with live room pricing in Indian Rupees (₹), amenities, and booking policies.\n\nWhere are you planning to travel next?")
                    .suggestedLink("/hotels")
                    .suggestedLinkText("Explore Destinations")
                    .modelUsed("stayease-assistant")
                    .build();
        }

        String[] words = q.split("\\s+");
        boolean isPureGreeting = q.equals("hi") || q.equals("hello") || q.equals("hey") || q.equals("namaste")
                || ((words.length > 0 && (words[0].equals("hi") || words[0].equals("hello") || words[0].equals("hey") || words[0].equals("namaste"))) && words.length <= 2);

        if (isPureGreeting) {
            return AiChatResponse.builder()
                    .reply("Namaste & warm welcome to StayEase! 🙏\n\nI am your StayEase Travel Assistant. Whether you are looking for a royal palace in Jaipur, a coastal villa in Goa, or a premier city hotel in Mumbai, Delhi, or abroad, I'm here to assist you.\n\nHow can I help you plan your journey today?")
                    .suggestedLink("/hotels")
                    .suggestedLinkText("Browse All Hotels")
                    .modelUsed("stayease-assistant")
                    .build();
        }

        if (q.contains("trip") || q.contains("itinerary") || q.contains("tour") || q.contains("plan")) {
            return AiChatResponse.builder()
                    .reply("Here is a recommended **2-Day Luxury Golden Triangle Itinerary**:\n\n" +
                           "• **Day 1 (Jaipur / Royal Rajasthan)**: Arrive and check in to **Rambagh Palace, Jaipur** (from ₹38,000/night). Explore Amber Fort, Hawa Mahal, and enjoy royal Rajasthani dining in the evening.\n\n" +
                           "• **Day 2 (Udaipur / Lakeside Romance)**: Head to **The Oberoi Udaivilas, Udaipur** (from ₹42,000/night) on Lake Pichola for private boat arrival and sunset lake dining.\n\n" +
                           "*(Tip: Set `GROQ_API_KEY` on your server to enable live dynamic AI reasoning for bespoke travel planning!)*")
                    .suggestedLink("/hotels?city=Jaipur")
                    .suggestedLinkText("View Jaipur Palaces")
                    .modelUsed("stayease-assistant")
                    .build();
        }

        if (q.contains("mumbai")) {
            return AiChatResponse.builder()
                    .reply("In Mumbai, stay at the iconic **The Taj Mahal Palace** (from ₹24,000/night) facing the Gateway of India & Arabian Sea, featuring 9 acclaimed restaurants and signature Jiva Spa.")
                    .suggestedLink("/hotels?city=Mumbai")
                    .suggestedLinkText("View Mumbai Hotels")
                    .modelUsed("stayease-assistant")
                    .build();
        }

        if (q.contains("jaipur") || q.contains("rajasthan") || q.contains("palace")) {
            return AiChatResponse.builder()
                    .reply("In Jaipur, experience royal living at **Rambagh Palace** (from ₹38,000/night) — the former Maharaja residence with 47 acres of gardens and traditional Rajputana courtyards.")
                    .suggestedLink("/hotels?city=Jaipur")
                    .suggestedLinkText("Explore Jaipur Palace")
                    .modelUsed("stayease-assistant")
                    .build();
        }

        if (q.contains("goa") || q.contains("beach")) {
            return AiChatResponse.builder()
                    .reply("For a seaside retreat, **Taj Exotica Resort & Spa in South Goa** (from ₹18,500/night) offers private access to Benaulim Beach, private plunge-pool villas, and Mediterranean dining.")
                    .suggestedLink("/hotels?city=Goa")
                    .suggestedLinkText("View Goa Resorts")
                    .modelUsed("stayease-assistant")
                    .build();
        }

        if (q.contains("delhi")) {
            return AiChatResponse.builder()
                    .reply("In New Delhi, **The Leela Palace** (from ₹22,000/night) in the Diplomatic Enclave combines royal Lutyens architecture with Michelin-grade dining and a rooftop infinity pool.")
                    .suggestedLink("/hotels?city=New Delhi")
                    .suggestedLinkText("View Delhi Properties")
                    .modelUsed("stayease-assistant")
                    .build();
        }

        if (q.contains("udaipur")) {
            return AiChatResponse.builder()
                    .reply("For romance, **The Oberoi Udaivilas** (from ₹42,000/night) on the shores of Lake Pichola features private boat arrivals, Mewar dome architecture, and lakeside dining pavilions.")
                    .suggestedLink("/hotels?city=Udaipur")
                    .suggestedLinkText("View Udaipur Palace")
                    .modelUsed("stayease-assistant")
                    .build();
        }

        if (q.contains("cancel") || q.contains("refund")) {
            return AiChatResponse.builder()
                    .reply("📋 **StayEase Cancellation Policy**:\n• **100% Full Refund**: If cancelled up to 48 hours before check-in.\n• **50% Refund**: If cancelled between 24 and 48 hours.\n• **Refund Timeline**: Processed within 24–48 hours to original UPI, Card, or NetBanking.")
                    .suggestedLink("/cancellation-policy")
                    .suggestedLinkText("Read Cancellation Policy")
                    .modelUsed("stayease-assistant")
                    .build();
        }

        return AiChatResponse.builder()
                .reply("I'm here to assist your travel plans! Ask me about royal palaces in Jaipur or Udaipur, beach villas in Goa, 5-star properties in Mumbai, or our 100% free cancellation policy.")
                .suggestedLink("/hotels")
                .suggestedLinkText("Explore All Hotels")
                .modelUsed("stayease-assistant")
                .build();
    }
}
