package cz.bezcisobe.backend.repository;

import cz.bezcisobe.backend.entity.Race;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RaceRepository extends JpaRepository<Race, Long> {
}
