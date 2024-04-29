package pe.interbank.exchange.application.rest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import pe.interbank.exchange.application.request.ExchangeRateRequest;
import pe.interbank.exchange.application.response.ExchangeRateResponse;
import pe.interbank.exchange.domain.ExchangeRate;
import pe.interbank.exchange.domain.service.ExchangeRateService;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/v1/rates")
public class ExchangeRateResource {

    private final ExchangeRateService exchangeRateService;

    @PostMapping
    public ResponseEntity<ExchangeRateResponse> saveRateConversion(@Valid @RequestBody ExchangeRateRequest request) {
        ExchangeRateResponse response = exchangeRateService.saveConversion(request.getFromCurrency(), request.getToCurrency(), request.getAmount());
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().build().toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PostMapping("/conversions")
    public ResponseEntity<ExchangeRateResponse> getConversion(@Valid @RequestBody ExchangeRateRequest request) {
        ExchangeRateResponse response = exchangeRateService.getConversion(request.getFromCurrency(), request.getToCurrency(), request.getAmount());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/conversions")
    public ResponseEntity<List<ExchangeRate>> getConversionsHistory(Pageable pageable) {
        return ResponseEntity.ok(exchangeRateService.findConversionsByUser("", pageable));
    }
}
