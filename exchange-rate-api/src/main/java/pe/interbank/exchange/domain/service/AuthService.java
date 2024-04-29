package pe.interbank.exchange.domain.service;

import pe.interbank.exchange.application.request.LoginRequest;
import pe.interbank.exchange.application.request.RegisterRequest;
import pe.interbank.exchange.application.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);
}
