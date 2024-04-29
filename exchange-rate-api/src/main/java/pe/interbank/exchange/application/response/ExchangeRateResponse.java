package pe.interbank.exchange.application.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class ExchangeRateResponse {
    private String fromCurrency;
    private String toCurrency;
    private BigDecimal amount;
    private BigDecimal conversionRate;
    private BigDecimal conversionResult;
}
