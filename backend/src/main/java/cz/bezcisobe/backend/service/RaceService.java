package cz.bezcisobe.backend.service;

import cz.bezcisobe.backend.dto.mapper.RaceMapper;
import cz.bezcisobe.backend.dto.response.RaceResponse;
import cz.bezcisobe.backend.exception.ResourceNotFoundException;
import cz.bezcisobe.backend.repository.RaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RaceService {

    private final RaceRepository raceRepository;
    private final RaceMapper raceMapper;

    public List<RaceResponse> getAllRaces() {
        return raceRepository.findAll().stream()
                .map(raceMapper::toResponse)
                .toList();
    }

    public RaceResponse getRaceById(Long id) {
        return raceRepository.findById(id)
                .map(raceMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Závod nenalezen"));
    }
}
