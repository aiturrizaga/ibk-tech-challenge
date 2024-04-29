package pe.interbank.exchange.infrastructure.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;

@FeignClient(name = "exchange-rate", url = "${app.client.exchange-url}/v6")
public interface ExchangeRateClient {
    @GetMapping("/latest/{currencyCode}")
    Optional<ExchangeRateApi> findAll(@PathVariable String currencyCode);
}
