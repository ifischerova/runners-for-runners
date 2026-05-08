package cz.bezcisobe.backend.repository;

import cz.bezcisobe.backend.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RideRepository extends JpaRepository<Ride, UUID> {
    List<Ride> findByRaceId(Long raceId);
    List<Ride> findByUserId(UUID userId);
}
