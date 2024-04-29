package pe.interbank.exchange.application.rest.error;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestControllerAdvice
public class ResponseExceptionHandler extends ResponseEntityExceptionHandler {
    @Override
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        List<String> errors = new ArrayList<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            String fieldName = fieldError.getField();
            String errorMessage = fieldError.getDefaultMessage();
            errors.add("Field: " + fieldName + " - " + errorMessage);
        }

        ExceptionResponse response = ExceptionResponse.builder()
                .message("Validation failed")
                .timestamp(LocalDateTime.now())
                .details(errors)
                .build();

        log.error("[BAD_REQUEST] Validation failed {}", response);
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public final ResponseEntity<ExceptionResponse> handleGlobalException(Exception ex, WebRequest request) {
        log.error("[INTERNAL_SERVER_ERROR] Error message: {}", ex.getMessage());
        return ResponseEntity.internalServerError()
                .body(ExceptionResponse.builder()
                        .message(ex.getMessage())
                        .timestamp(LocalDateTime.now())
                        .details(List.of(request.getDescription(false)))
                        .build());
    }

    @ExceptionHandler(BusinessException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ExceptionResponse> handleNotFoundException(BusinessException ex, WebRequest request) {
        log.error("[BUSINESS_EXCEPTION] Error message: {}", ex.getMessage());
        ExceptionResponse error = ExceptionResponse.builder()
                .message(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .details(List.of(request.getDescription(false)))
                .build();
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
