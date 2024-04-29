package pe.interbank.exchange.domain.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pe.interbank.exchange.application.response.ExchangeRateResponse;
import pe.interbank.exchange.application.rest.error.BusinessException;
import pe.interbank.exchange.domain.ExchangeRate;
import pe.interbank.exchange.domain.repository.ExchangeRateRepository;
import pe.interbank.exchange.domain.service.ExchangeRateService;
import pe.interbank.exchange.infrastructure.client.ExchangeRateClient;
import pe.interbank.exchange.infrastructure.security.SecurityUtils;

import java.math.BigDecimal;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ExchangeRateServiceImpl implements ExchangeRateService {

    private final ExchangeRateClient exchangeRateClient;
    private final ExchangeRateRepository exchangeRateRepository;

    @Override
    public ExchangeRateResponse getConversion(String fromCurrency, String toCurrency, BigDecimal amount) {
        ExchangeRate exchangeRate = getExchangeRateConversion(fromCurrency, toCurrency, amount);
        return ExchangeRateResponse.builder()
                .fromCurrency(exchangeRate.getBaseCurrency())
                .toCurrency(exchangeRate.getTargetCurrency())
                .amount(exchangeRate.getAmountConvert())
                .conversionRate(exchangeRate.getConversionRate())
                .conversionResult(exchangeRate.getConversionResult())
                .build();
    }

    @Override
    public ExchangeRateResponse saveConversion(String fromCurrency, String toCurrency, BigDecimal amount) {
        log.info("Saving exchange rate from: {} to: {} amount: {}", fromCurrency, toCurrency, amount);
        ExchangeRate exchangeRate = exchangeRateRepository.save(getExchangeRateConversion(fromCurrency, toCurrency, amount));
        return ExchangeRateResponse.builder()
                .fromCurrency(exchangeRate.getBaseCurrency())
                .toCurrency(exchangeRate.getTargetCurrency())
                .amount(exchangeRate.getAmountConvert())
                .conversionRate(exchangeRate.getConversionRate())
                .conversionResult(exchangeRate.getConversionResult())
                .build();
    }

    @Override
    public List<ExchangeRate> findConversionsByUser(String username, Pageable pageable) {
        String user = SecurityUtils.getCurrentUserLogin().orElse(username);
        return exchangeRateRepository.findAllByCreatedBy(user, pageable).toList();
    }

    private ExchangeRate getExchangeRateConversion(String fromCurrency, String toCurrency, BigDecimal amount) {
        return exchangeRateClient.findAll(fromCurrency)
                .map(res -> {
                    if (!res.getRates().containsKey(toCurrency)) {
                        log.error("Currency {} not found", toCurrency);
                        throw new BusinessException(String.format("Currency %s is not found in the exchange rates map.", toCurrency));
                    }
                    BigDecimal rate = res.getRates().get(toCurrency);
                    BigDecimal conversionResult = amount.multiply(rate);
                    ExchangeRate exchangeRate = new ExchangeRate();
                    exchangeRate.setBaseCurrency(fromCurrency);
                    exchangeRate.setTargetCurrency(toCurrency);
                    exchangeRate.setAmountConvert(amount);
                    exchangeRate.setConversionRate(rate);
                    exchangeRate.setConversionResult(conversionResult);
                    log.info("Conversion exchange rate result: {}", exchangeRate);
                    return exchangeRate;
                })
                .orElseThrow(() -> new BusinessException(String.format("Currency %s is not found in the exchange rates map.", toCurrency)));
    }

}
