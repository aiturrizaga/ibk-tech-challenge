package pe.interbank.exchange;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pe.interbank.exchange.domain.Role;
import pe.interbank.exchange.domain.User;
import pe.interbank.exchange.domain.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        final String username = "admin@gmail.com";
        final String password = "admin";
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setName("John");
        user.setLastname("Doe");
        user.setRole(Role.ADMIN);
        userRepository.save(user);
    }
}
