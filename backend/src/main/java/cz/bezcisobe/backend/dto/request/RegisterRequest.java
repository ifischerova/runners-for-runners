package cz.bezcisobe.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Uživatelské jméno je povinné")
        @Size(min = 3, max = 50, message = "Uživatelské jméno musí mít 3-50 znaků")
        String username,

        @NotBlank(message = "Email je povinný")
        @Email(message = "Neplatný formát emailu")
        String email,

        @NotBlank(message = "Heslo je povinné")
        @Size(min = 6, message = "Heslo musí mít alespoň 6 znaků")
        String password,

        @Pattern(regexp = "cs|en", message = "{validation.language.invalid}")
        String language
) {}
