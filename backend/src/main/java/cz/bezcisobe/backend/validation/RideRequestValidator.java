package cz.bezcisobe.backend.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * Implementation of {@link ValidRideRequest}.
 *
 * <p>Validators implement this interface to support both
 * {@code CreateRideRequest} and {@code UpdateRideRequest} without inheritance:
 * the DTO simply implements {@link RideRequestPayload} so the same validator
 * can read the relevant fields.</p>
 */
public class RideRequestValidator
        implements ConstraintValidator<ValidRideRequest, RideRequestPayload> {

    private static final String OFFER = "OFFER";
    private static final String REQUEST = "REQUEST";

    @Override
    public boolean isValid(RideRequestPayload payload, ConstraintValidatorContext ctx) {
        if (payload == null || payload.type() == null) {
            // @NotBlank on `type` reports the missing value; we don't double-report here.
            return true;
        }

        String type = payload.type();
        boolean valid = true;
        ctx.disableDefaultConstraintViolation();

        if (OFFER.equals(type)) {
            if (isBlank(payload.car())) {
                ctx.buildConstraintViolationWithTemplate(
                        "Pro nabídku jízdy (OFFER) je povinné vyplnit auto")
                        .addPropertyNode("car")
                        .addConstraintViolation();
                valid = false;
            }
            if (payload.availableSeats() == null || payload.availableSeats() < 1) {
                ctx.buildConstraintViolationWithTemplate(
                        "Pro nabídku jízdy (OFFER) musí být alespoň 1 volné místo")
                        .addPropertyNode("availableSeats")
                        .addConstraintViolation();
                valid = false;
            }
        } else if (REQUEST.equals(type)) {
            if (!isBlank(payload.car())) {
                ctx.buildConstraintViolationWithTemplate(
                        "U poptávky jízdy (REQUEST) nesmí být vyplněno auto")
                        .addPropertyNode("car")
                        .addConstraintViolation();
                valid = false;
            }
        } else {
            ctx.buildConstraintViolationWithTemplate(
                    "Typ jízdy musí být OFFER nebo REQUEST")
                    .addPropertyNode("type")
                    .addConstraintViolation();
            valid = false;
        }

        return valid;
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
