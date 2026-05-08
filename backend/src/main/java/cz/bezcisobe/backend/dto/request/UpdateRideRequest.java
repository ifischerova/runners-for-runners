package cz.bezcisobe.backend.dto.request;

import cz.bezcisobe.backend.validation.RideRequestPayload;
import cz.bezcisobe.backend.validation.ValidRideRequest;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Payload for {@code PUT /api/rides/{id}}. Same shape and constraints as
 * {@link CreateRideRequest} except {@code raceId} cannot be changed (a ride
 * is bound to its race for life).
 */
@ValidRideRequest
public record UpdateRideRequest(
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
) implements RideRequestPayload {}
