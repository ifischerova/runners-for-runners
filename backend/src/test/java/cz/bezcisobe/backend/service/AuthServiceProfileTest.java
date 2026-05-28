package cz.bezcisobe.backend.service;

import cz.bezcisobe.backend.dto.mapper.UserMapper;
import cz.bezcisobe.backend.dto.request.UpdateProfileRequest;
import cz.bezcisobe.backend.dto.response.UserResponse;
import cz.bezcisobe.backend.entity.Role;
import cz.bezcisobe.backend.entity.User;
import cz.bezcisobe.backend.exception.BadRequestException;
import cz.bezcisobe.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceProfileTest {

    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock EmailService emailService;
    @Mock UserMapper userMapper;
    @InjectMocks AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(UUID.randomUUID())
                .username("ivka")
                .email("ivka@example.com")
                .password("HASHED_OLD")
                .language("cs")
                .emailVerified(true)
                .roles(Set.of(Role.ROLE_USER))
                .build();
    }

    @Test
    void changePassword_savesAndNotifies() {
        when(userRepository.findByUsername("ivka")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old", "HASHED_OLD")).thenReturn(true);
        when(passwordEncoder.encode("newPass")).thenReturn("HASHED_NEW");

        authService.changePassword("ivka", "old", "newPass");

        verify(userRepository).save(argThat(u -> u.getPassword().equals("HASHED_NEW")));
        verify(emailService).sendPasswordChangedEmail(eq("ivka@example.com"), any());
    }

    @Test
    void changePassword_rejectsWrongCurrent() {
        when(userRepository.findByUsername("ivka")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "HASHED_OLD")).thenReturn(false);

        assertThatThrownBy(() -> authService.changePassword("ivka", "wrong", "newPass"))
                .isInstanceOf(BadRequestException.class)
                .extracting("messageKey").isEqualTo("error.auth.invalid_current_password");

        verify(userRepository, never()).save(any());
        verify(emailService, never()).sendPasswordChangedEmail(any(), any());
    }

    @Test
    void updateProfile_partialUpdateSavesAndReturnsResponse() {
        when(userRepository.findByUsername("ivka")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(userMapper.toResponse(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            return new UserResponse(
                    u.getId() == null ? null : u.getId().toString(),
                    u.getUsername(),
                    u.getEmail(),
                    u.getFirstName(),
                    u.getLastName(),
                    u.getCity(),
                    u.getLanguage(),
                    List.of("ROLE_USER")
            );
        });

        UpdateProfileRequest req = new UpdateProfileRequest("Iva", null, "Praha", "en");
        UserResponse resp = authService.updateProfile("ivka", req);

        assertThat(resp.firstName()).isEqualTo("Iva");
        assertThat(resp.city()).isEqualTo("Praha");
        assertThat(resp.language()).isEqualTo("en");
    }
}
