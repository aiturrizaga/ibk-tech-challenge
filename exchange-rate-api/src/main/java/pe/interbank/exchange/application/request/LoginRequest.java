package pe.interbank.exchange.application.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LoginRequest {
    @NotEmpty
    @Email
    private String username;

    @NotEmpty
    @Size(min = 4, max = 50)
    private String password;
}
