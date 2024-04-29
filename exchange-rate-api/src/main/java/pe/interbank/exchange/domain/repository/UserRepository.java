package pe.interbank.exchange.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.interbank.exchange.domain.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
}
