package pe.interbank.exchange.domain.service;

import pe.interbank.exchange.application.response.CurrencyResponse;

import java.util.List;
import java.util.Optional;

public interface CurrencyService {
    List<CurrencyResponse> findAll();

    Optional<CurrencyResponse> findByCode(String code);
}
