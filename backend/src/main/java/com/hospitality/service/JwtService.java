package com.hospitality.service;

import com.hospitality.entity.User;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
@Slf4j
public class JwtService {

    @Value("${app.jwt.secret:stayease-luxury-hospitality-jwt-secret-key-must-be-256-bits-minimum!}")
    private String jwtSecret;

    // 7 days validity
    private static final long EXPIRATION_TIME_MS = 7L * 24 * 60 * 60 * 1000;

    public String generateToken(User user) {
        try {
            byte[] secretBytes = getSecretBytes();
            JWSSigner signer = new MACSigner(secretBytes);

            Date now = new Date();
            Date expiry = new Date(now.getTime() + EXPIRATION_TIME_MS);

            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(user.getClerkId())
                    .claim("sub", user.getClerkId())
                    .claim("email", user.getEmail())
                    .claim("given_name", user.getFirstName() != null ? user.getFirstName() : "")
                    .claim("family_name", user.getLastName() != null ? user.getLastName() : "")
                    .claim("role", user.getRole() != null ? user.getRole().name() : "GUEST")
                    .issueTime(now)
                    .expirationTime(expiry)
                    .build();

            SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);
            signedJWT.sign(signer);

            return signedJWT.serialize();
        } catch (Exception e) {
            log.error("Failed to generate JWT token for user {}: {}", user.getEmail(), e.getMessage());
            throw new RuntimeException("Error generating authentication token", e);
        }
    }

    public byte[] getSecretBytes() {
        String key = jwtSecret;
        if (key == null || key.length() < 32) {
            key = "stayease-luxury-hospitality-jwt-secret-key-must-be-256-bits-minimum!";
        }
        return key.getBytes(StandardCharsets.UTF_8);
    }
}
