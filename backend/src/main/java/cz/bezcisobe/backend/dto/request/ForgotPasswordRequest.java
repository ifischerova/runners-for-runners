package cz.bezcisobe.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
        @NotBlank(message = "Email je povinný")
        @Email(message = "Neplatný formát emailu")
        String email
) {}
