package cz.bezcisobe.backend.service;

import cz.bezcisobe.backend.dto.mapper.RideMapper;
import cz.bezcisobe.backend.dto.request.CreateRideRequest;
import cz.bezcisobe.backend.dto.response.RideResponse;
import cz.bezcisobe.backend.entity.Race;
import cz.bezcisobe.backend.entity.Ride;
import cz.bezcisobe.backend.entity.RideType;
import cz.bezcisobe.backend.entity.User;
import cz.bezcisobe.backend.exception.BadRequestException;
import cz.bezcisobe.backend.exception.ResourceNotFoundException;
import cz.bezcisobe.backend.repository.RaceRepository;
import cz.bezcisobe.backend.repository.RideRepository;
import cz.bezcisobe.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;
    private final RaceRepository raceRepository;
    private final UserRepository userRepository;
    private final RideMapper rideMapper;

    public List<RideResponse> getRidesByRace(Long raceId) {
        return rideRepository.findByRaceId(raceId).stream()
                .map(rideMapper::toResponse)
                .toList();
    }

    @Transactional
    public RideResponse createRide(CreateRideRequest request, UUID userId) {
        Race race = raceRepository.findById(request.raceId())
                .orElseThrow(() -> new ResourceNotFoundException("Závod nenalezen"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Uživatel nenalezen"));

        RideType type;
        try {
            type = RideType.valueOf(request.type());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Neplatný typ jízdy");
        }

        Ride ride = Ride.builder()
                .race(race)
                .user(user)
                .type(type)
                .from(request.from())
                .to(request.to())
                .car(request.car())
                .availableSeats(request.availableSeats())
                .occupiedSeats(0)
                .notes(request.notes())
                .build();

        Ride saved = rideRepository.save(ride);
        return rideMapper.toResponse(saved);
    }

    @Transactional
    public void deleteRide(UUID rideId, UUID userId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Jízda nenalezena"));

        if (!ride.getUser().getId().equals(userId)) {
            throw new BadRequestException("Nemáte oprávnění smazat tuto jízdu");
        }

        rideRepository.delete(ride);
    }

    @Transactional
    public RideResponse acceptRide(UUID rideId, UUID passengerId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Jízda nenalezena"));
        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new ResourceNotFoundException("Uživatel nenalezen"));

        if (ride.getOccupiedSeats() >= ride.getAvailableSeats()) {
            throw new BadRequestException("Nejsou k dispozici žádná volná místa");
        }

        boolean alreadyPassenger = ride.getPassengers().stream()
                .anyMatch(p -> p.getId().equals(passengerId));
        if (alreadyPassenger) {
            throw new BadRequestException("Již jste přihlášeni k této jízdě");
        }

        ride.getPassengers().add(passenger);
        ride.setOccupiedSeats(ride.getOccupiedSeats() + 1);
        Ride saved = rideRepository.save(ride);
        return rideMapper.toResponse(saved);
    }

    @Transactional
    public RideResponse cancelRideAcceptance(UUID rideId, UUID passengerId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Jízda nenalezena"));

        boolean removed = ride.getPassengers().removeIf(p -> p.getId().equals(passengerId));
        if (!removed) {
            throw new BadRequestException("Nejste přihlášeni k této jízdě");
        }

        ride.setOccupiedSeats(ride.getOccupiedSeats() - 1);
        Ride saved = rideRepository.save(ride);
        return rideMapper.toResponse(saved);
    }
}
