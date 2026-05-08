package cz.bezcisobe.backend.dto.mapper;

import cz.bezcisobe.backend.dto.response.RaceResponse;
import cz.bezcisobe.backend.entity.Race;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RaceMapper {

    public RaceResponse toResponse(Race race) {
        List<RaceResponse.RefItem> certs = race.getCertifications().stream()
                .map(c -> new RaceResponse.RefItem(c.getId().toString(), c.getName()))
                .toList();

        return new RaceResponse(
                race.getId().toString(),
                race.getName(),
                race.getPlace(),
                race.getDate().toString(),
                race.getStartTime().toString().substring(0, 5), // HH:mm
                race.getWeb(),
                new RaceResponse.RefItem(
                        race.getTrackLength().getId().toString(),
                        race.getTrackLength().getName()
                ),
                new RaceResponse.RefItem(
                        race.getTrackType().getId().toString(),
                        race.getTrackType().getName()
                ),
                certs,
                race.getRaceCalendar() != null
                        ? race.getRaceCalendar().getId().toString()
                        : null
        );
    }
}
