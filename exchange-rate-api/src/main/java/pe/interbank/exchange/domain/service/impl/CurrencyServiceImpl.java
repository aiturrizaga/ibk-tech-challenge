package pe.interbank.exchange.domain.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.interbank.exchange.application.response.CurrencyResponse;
import pe.interbank.exchange.domain.Currency;
import pe.interbank.exchange.domain.service.CurrencyService;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CurrencyServiceImpl implements CurrencyService {

    @Override
    public List<CurrencyResponse> findAll() {
        return Arrays.stream(Currency.values())
                .map(currency -> CurrencyResponse.builder()
                        .name(currency.getName())
                        .code(currency.getCode())
                        .country(currency.getCountry())
                        .symbol(currency.getSymbol())
                        .flagUrl(currency.getFlagUrl())
                        .build()
                ).toList();
    }

    @Override
    public Optional<CurrencyResponse> findByCode(String code) {
        return Arrays.stream(Currency.values())
                .filter(currency -> currency.getCode().equalsIgnoreCase(code))
                .findFirst()
                .map(currency -> CurrencyResponse.builder()
                        .name(currency.getName())
                        .code(currency.getCode())
                        .country(currency.getCountry())
                        .symbol(currency.getSymbol())
                        .flagUrl(currency.getFlagUrl())
                        .build()
                );
    }
}
