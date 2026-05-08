package cz.bezcisobe.backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateRideRequest(
        @NotNull(message = "ID závodu je povinné")
        Long raceId,

        @NotBlank(message = "Typ jízdy je povinný")
        String type,

        @NotBlank(message = "Místo odjezdu je povinné")
        String from,

        String to,

        String car,

        @NotNull(message = "Počet míst je povinný")
        @Min(value = 1, message = "Minimální počet míst je 1")
        @Max(value = 10, message = "Maximální počet míst je 10")
        Integer availableSeats,

        String notes
) {}
