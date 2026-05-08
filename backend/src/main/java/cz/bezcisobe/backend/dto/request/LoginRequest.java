package cz.bezcisobe.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Uživatelské jméno je povinné")
        String username,

        @NotBlank(message = "Heslo je povinné")
        String password
) {}
