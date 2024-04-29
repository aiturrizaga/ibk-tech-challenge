package pe.interbank.exchange.domain.service;

import org.springframework.data.domain.Pageable;
import pe.interbank.exchange.application.response.ExchangeRateResponse;
import pe.interbank.exchange.domain.ExchangeRate;

import java.math.BigDecimal;
import java.util.List;

public interface ExchangeRateService {
    ExchangeRateResponse getConversion(String fromCurrency, String toCurrency, BigDecimal amount);

    ExchangeRateResponse saveConversion(String fromCurrency, String toCurrency, BigDecimal amount);

    List<ExchangeRate> findConversionsByUser(String username, Pageable pageable);
}
