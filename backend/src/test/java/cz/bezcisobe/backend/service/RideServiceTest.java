package cz.bezcisobe.backend.service;

import cz.bezcisobe.backend.dto.mapper.RideMapper;
import cz.bezcisobe.backend.dto.request.UpdateRideRequest;
import cz.bezcisobe.backend.dto.response.RideResponse;
import cz.bezcisobe.backend.entity.*;
import cz.bezcisobe.backend.exception.BadRequestException;
import cz.bezcisobe.backend.exception.ResourceNotFoundException;
import cz.bezcisobe.backend.repository.RaceRepository;
import cz.bezcisobe.backend.repository.RideRepository;
import cz.bezcisobe.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RideServiceTest {

    @Mock private RideRepository rideRepository;
    @Mock private RaceRepository raceRepository;
    @Mock private UserRepository userRepository;
    @Mock private RideMapper rideMapper;

    @InjectMocks
    private RideService rideService;

    private UUID rideId;
    private UUID ownerId;
    private UUID passengerId;
    private Ride ride;
    private User owner;
    private User passenger;

    @BeforeEach
    void setUp() {
        rideId = UUID.randomUUID();
        ownerId = UUID.randomUUID();
        passengerId = UUID.randomUUID();

        owner = User.builder().id(ownerId).username("owner").build();
        passenger = User.builder().id(passengerId).username("passenger").build();

        ride = Ride.builder()
                .id(rideId)
                .user(owner)
                .type(RideType.OFFER)
                .from("Praha")
                .availableSeats(3)
                .occupiedSeats(0)
                .passengers(new HashSet<>())
                .createdAt(Instant.now())
                .build();
    }

    @Test
    void acceptRide_success() {
        when(rideRepository.findById(rideId)).thenReturn(Optional.of(ride));
        when(userRepository.findById(passengerId)).thenReturn(Optional.of(passenger));
        when(rideRepository.save(any())).thenReturn(ride);
        when(rideMapper.toResponse(any())).thenReturn(
                new RideResponse(rideId.toString(), "1", ownerId.toString(), "OFFER",
                        "Praha", null, null, 3, 1, List.of(passengerId.toString()), null, Instant.now().toString()));

        RideResponse result = rideService.acceptRide(rideId, passengerId);

        assertNotNull(result);
        assertEquals(1, ride.getOccupiedSeats());
        assertTrue(ride.getPassengers().contains(passenger));
    }

    @Test
    void acceptRide_full() {
        ride.setOccupiedSeats(3);
        when(rideRepository.findById(rideId)).thenReturn(Optional.of(ride));
        when(userRepository.findById(passengerId)).thenReturn(Optional.of(passenger));

        assertThrows(BadRequestException.class, () -> rideService.acceptRide(rideId, passengerId));
    }

    @Test
    void acceptRide_duplicate() {
        ride.getPassengers().add(passenger);
        when(rideRepository.findById(rideId)).thenReturn(Optional.of(ride));
        when(userRepository.findById(passengerId)).thenReturn(Optional.of(passenger));

        assertThrows(BadRequestException.class, () -> rideService.acceptRide(rideId, passengerId));
    }

    @Test
    void cancelRideAcceptance_notPassenger() {
        when(rideRepository.findById(rideId)).thenReturn(Optional.of(ride));

        assertThrows(BadRequestException.class, () -> rideService.cancelRideAcceptance(rideId, passengerId));
    }

    @Test
    void deleteRide_notOwner() {
        when(rideRepository.findById(rideId)).thenReturn(Optional.of(ride));

        assertThrows(BadRequestException.class, () -> rideService.deleteRide(rideId, passengerId));
    }

    @Test
    void deleteRide_notFound() {
        when(rideRepository.findById(rideId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> rideService.deleteRide(rideId, ownerId));
    }

    @Test
    void updateRide_byOwner_success() {
        UpdateRideRequest req = new UpdateRideRequest(
                "OFFER", "Brno", "Praha", "Škoda", 2, "Updated note");
        when(rideRepository.findById(rideId)).thenReturn(Optional.of(ride));
        when(rideRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(rideMapper.toResponse(any())).thenReturn(
                new RideResponse(rideId.toString(), "1", ownerId.toString(), "OFFER",
                        "Brno", "Praha", "Škoda", 2, 0, List.of(), "Updated note", Instant.now().toString()));

        RideResponse result = rideService.updateRide(rideId, req, ownerId);

        assertNotNull(result);
        assertEquals("Brno", ride.getFrom());
        assertEquals("Škoda", ride.getCar());
        assertEquals(2, ride.getAvailableSeats());
    }

    @Test
    void updateRide_notOwner() {
        UpdateRideRequest req = new UpdateRideRequest(
                "OFFER", "Brno", "Praha", "Škoda", 2, null);
        when(rideRepository.findById(rideId)).thenReturn(Optional.of(ride));

        assertThrows(BadRequestException.class,
                () -> rideService.updateRide(rideId, req, passengerId));
    }

    @Test
    void updateRide_seatsBelowOccupied() {
        ride.setOccupiedSeats(2);
        UpdateRideRequest req = new UpdateRideRequest(
                "OFFER", "Praha", null, "Škoda", 1, null);
        when(rideRepository.findById(rideId)).thenReturn(Optional.of(ride));

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> rideService.updateRide(rideId, req, ownerId));
        assertTrue(ex.getMessage().contains("2"),
                "Error message should mention current occupant count");
    }

    @Test
    void updateRide_notFound() {
        UpdateRideRequest req = new UpdateRideRequest(
                "OFFER", "Praha", null, "Škoda", 1, null);
        when(rideRepository.findById(rideId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> rideService.updateRide(rideId, req, ownerId));
    }

    @Test
    void deleteRideAsAdmin_success() {
        UUID adminId = UUID.randomUUID();
        when(rideRepository.findById(rideId)).thenReturn(Optional.of(ride));

        rideService.deleteRideAsAdmin(rideId, adminId);

        verify(rideRepository).delete(ride);
    }

    @Test
    void deleteRideAsAdmin_notFound() {
        when(rideRepository.findById(rideId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> rideService.deleteRideAsAdmin(rideId, UUID.randomUUID()));
    }
}
