package cz.bezcisobe.backend.controller;

import cz.bezcisobe.backend.dto.request.CreateRideRequest;
import cz.bezcisobe.backend.dto.response.RideResponse;
import cz.bezcisobe.backend.security.UserDetailsImpl;
import cz.bezcisobe.backend.service.RideService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideController {

    private final RideService rideService;

    @GetMapping
    public ResponseEntity<List<RideResponse>> getRidesByRace(@RequestParam Long raceId) {
        return ResponseEntity.ok(rideService.getRidesByRace(raceId));
    }

    @PostMapping
    public ResponseEntity<RideResponse> createRide(
            @Valid @RequestBody CreateRideRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(rideService.createRide(request, userDetails.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRide(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        rideService.deleteRide(id, userDetails.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<RideResponse> acceptRide(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(rideService.acceptRide(id, userDetails.getId()));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<RideResponse> cancelRideAcceptance(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(rideService.cancelRideAcceptance(id, userDetails.getId()));
    }
}
