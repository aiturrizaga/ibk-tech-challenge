package pe.interbank.exchange.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import pe.interbank.exchange.infrastructure.security.SecurityAuditorAware;

@Configuration
@EnableJpaAuditing
public class PersistenceConfig {
    @Bean
    AuditorAware<String> auditorProvider() {
        return new SecurityAuditorAware();
    }
}
