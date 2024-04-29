package pe.interbank.exchange.application.rest.error;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString
@Builder
public class ExceptionResponse {
    private LocalDateTime timestamp;
    private String message;
    private List<String> details;
}
