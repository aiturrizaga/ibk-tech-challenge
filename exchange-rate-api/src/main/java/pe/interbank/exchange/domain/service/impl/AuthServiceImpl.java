package pe.interbank.exchange.domain.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pe.interbank.exchange.application.request.LoginRequest;
import pe.interbank.exchange.application.request.RegisterRequest;
import pe.interbank.exchange.application.response.AuthResponse;
import pe.interbank.exchange.domain.Role;
import pe.interbank.exchange.domain.User;
import pe.interbank.exchange.domain.repository.UserRepository;
import pe.interbank.exchange.domain.service.AuthService;
import pe.interbank.exchange.infrastructure.security.JwtUtil;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        String token = jwtUtil.getToken(user);
        Long expiration = jwtUtil.getExpirationDateFromToken(token).getTime();
        return AuthResponse.builder()
                .token(token)
                .expiresIn(expiration)
                .build();
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setLastname(request.getLastname());
        user.setRole(Role.USER);
        userRepository.save(user);

        String token = jwtUtil.getToken(user);
        Long expiration = jwtUtil.getExpirationDateFromToken(token).getTime();
        return AuthResponse.builder()
                .token(token)
                .expiresIn(expiration)
                .build();
    }
}
