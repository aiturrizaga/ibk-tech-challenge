package pe.interbank.exchange.application.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.interbank.exchange.application.response.CurrencyResponse;
import pe.interbank.exchange.domain.service.CurrencyService;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/currencies")
public class CurrencyResource {

    private final CurrencyService currencyService;

    @GetMapping
    public ResponseEntity<List<CurrencyResponse>> getAllCurrencies() {
        return ResponseEntity.ok(currencyService.findAll());
    }

    @GetMapping("/{code}")
    public ResponseEntity<Optional<CurrencyResponse>> getOneCurrency(@PathVariable String code) {
        return ResponseEntity.ok(currencyService.findByCode(code));
    }
}
