package com.healthpal.api.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * JwtAccessDeniedHandler - Handles Access Denied Errors
 * 
 * This class is triggered when an authenticated user tries to access a resource
 * they don't have permission to access (e.g., user trying to access admin endpoint)
 * It returns a JSON response with error details
 * 
 * @author HealthPal Team - Person A (Authentication + Admin + Core Architecture)
 * @version 1.0
 */
@Slf4j
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    /**
     * Handle access denied error
     * @param request The HTTP request
     * @param response The HTTP response
     * @param accessDeniedException The access denied exception
     * @throws IOException If I/O error occurs
     * @throws ServletException If servlet error occurs
     */
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException)
            throws IOException, ServletException {

        log.error("Responding with access denied error. Message: {}", accessDeniedException.getMessage());

        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);

        final Map<String, Object> body = new HashMap<>();
        body.put("status", HttpServletResponse.SC_FORBIDDEN);
        body.put("error", "Forbidden");
        body.put("message", "You do not have permission to access this resource");
        body.put("path", request.getServletPath());

        final ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(response.getOutputStream(), body);
    }
}
