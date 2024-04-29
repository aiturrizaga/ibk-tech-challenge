package pe.interbank.exchange.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import pe.interbank.exchange.domain.ExchangeRate;

public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, String> {
    Page<ExchangeRate> findAllByCreatedBy(String createdBy, Pageable pageable);
}
