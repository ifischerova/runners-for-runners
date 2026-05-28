package cz.bezcisobe.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank(message = "Token je povinný")
        String token,

        @NotBlank(message = "Heslo je povinné")
        @Size(min = 6, message = "Heslo musí mít alespoň 6 znaků")
        String password
) {}
