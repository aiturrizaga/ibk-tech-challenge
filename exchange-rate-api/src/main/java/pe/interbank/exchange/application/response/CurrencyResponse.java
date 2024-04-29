package pe.interbank.exchange.application.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CurrencyResponse {
    private String name;
    private String code;
    private String country;
    private String symbol;
    private String flagUrl;
}
