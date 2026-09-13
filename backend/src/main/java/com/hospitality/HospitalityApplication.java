package com.hospitality;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

import java.io.BufferedReader;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SpringBootApplication
public class HospitalityApplication {

    public static void main(String[] args) {
        loadDotEnv();
        Map<String, Object> dbProperties = resolveDatabaseProperties();

        new SpringApplicationBuilder(HospitalityApplication.class)
                .properties(dbProperties)
                .run(args);
    }

    private static void loadDotEnv() {
        List<Path> candidatePaths = Arrays.asList(
                Paths.get(".env"),
                Paths.get("backend/.env"),
                Paths.get("../backend/.env")
        );

        for (Path path : candidatePaths) {
            if (Files.exists(path)) {
                try (BufferedReader reader = Files.newBufferedReader(path)) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) {
                            continue;
                        }
                        int eqIdx = line.indexOf('=');
                        if (eqIdx > 0) {
                            String key = line.substring(0, eqIdx).trim();
                            String value = line.substring(eqIdx + 1).trim();
                            if ((value.startsWith("\"") && value.endsWith("\"")) ||
                                (value.startsWith("'") && value.endsWith("'"))) {
                                if (value.length() >= 2) {
                                    value = value.substring(1, value.length() - 1);
                                }
                            }
                            if (System.getenv(key) == null && System.getProperty(key) == null) {
                                System.setProperty(key, value);
                            }
                        }
                    }
                } catch (Exception ignored) {
                }
                break;
            }
        }
    }

    private static Map<String, Object> resolveDatabaseProperties() {
        Map<String, Object> props = new HashMap<>();

        String dbUrl = System.getenv("DATABASE_URL");
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = System.getProperty("DATABASE_URL");
        }
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = System.getenv("DB_URL");
        }
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = System.getProperty("DB_URL");
        }
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        }

        if (dbUrl != null && !dbUrl.isBlank()) {
            dbUrl = dbUrl.trim();
            if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
                try {
                    URI uri = URI.create(dbUrl);
                    String userInfo = uri.getUserInfo();
                    String host = uri.getHost();
                    int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                    String path = uri.getPath();
                    String query = uri.getQuery();

                    if (userInfo != null && userInfo.contains(":")) {
                        String[] parts = userInfo.split(":", 2);
                        props.put("spring.datasource.username", parts[0]);
                        props.put("spring.datasource.password", parts[1]);
                        System.setProperty("DB_USERNAME", parts[0]);
                        System.setProperty("DB_PASSWORD", parts[1]);
                    }

                    if (query != null && query.contains("channel_binding=")) {
                        query = query.replaceAll("&?channel_binding=[^&]*", "");
                        if (query.startsWith("&")) {
                            query = query.substring(1);
                        }
                    }

                    String cleanJdbcUrl = "jdbc:postgresql://" + host + ":" + port + path + (query != null && !query.isBlank() ? "?" + query : "");
                    props.put("spring.datasource.url", cleanJdbcUrl);
                    props.put("DB_URL", cleanJdbcUrl);
                    System.setProperty("DB_URL", cleanJdbcUrl);
                } catch (Exception e) {
                    String clean = dbUrl.startsWith("postgresql://") ? "jdbc:" + dbUrl : "jdbc:postgresql://" + dbUrl.substring("postgres://".length());
                    props.put("spring.datasource.url", clean);
                    props.put("DB_URL", clean);
                }
            } else if (dbUrl.startsWith("jdbc:postgresql://")) {
                props.put("spring.datasource.url", dbUrl);
                props.put("DB_URL", dbUrl);
            }
        }

        String username = System.getenv("DB_USERNAME");
        if (username == null || username.isBlank()) {
            username = System.getProperty("DB_USERNAME");
        }
        if (username != null && !username.isBlank() && !props.containsKey("spring.datasource.username")) {
            props.put("spring.datasource.username", username.trim());
        }

        String password = System.getenv("DB_PASSWORD");
        if (password == null || password.isBlank()) {
            password = System.getProperty("DB_PASSWORD");
        }
        if (password != null && !password.isBlank() && !props.containsKey("spring.datasource.password")) {
            props.put("spring.datasource.password", password.trim());
        }

        props.put("spring.datasource.driver-class-name", "org.postgresql.Driver");
        return props;
    }
}
