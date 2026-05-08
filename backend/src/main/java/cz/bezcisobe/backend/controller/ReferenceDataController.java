package cz.bezcisobe.backend.controller;

import cz.bezcisobe.backend.dto.response.RaceCalendarResponse;
import cz.bezcisobe.backend.dto.response.RaceResponse;
import cz.bezcisobe.backend.service.ReferenceDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reference")
@RequiredArgsConstructor
public class ReferenceDataController {

    private final ReferenceDataService referenceDataService;

    @GetMapping("/track-lengths")
    public ResponseEntity<List<RaceResponse.RefItem>> getTrackLengths() {
        return ResponseEntity.ok(referenceDataService.getTrackLengths());
    }

    @GetMapping("/track-types")
    public ResponseEntity<List<RaceResponse.RefItem>> getTrackTypes() {
        return ResponseEntity.ok(referenceDataService.getTrackTypes());
    }

    @GetMapping("/race-calendars")
    public ResponseEntity<List<RaceCalendarResponse>> getRaceCalendars() {
        return ResponseEntity.ok(referenceDataService.getRaceCalendars());
    }
}
