package pe.interbank.exchange.application.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@Getter
@Setter
@ToString
public class ExchangeRateRequest {
    @NotEmpty
    @Size(min = 3)
    private String fromCurrency;

    @NotEmpty
    @Size(min = 3)
    private String toCurrency;

    @NotNull
    @Positive
    private BigDecimal amount;
}
