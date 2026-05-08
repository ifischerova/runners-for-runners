package cz.bezcisobe.backend.service;

import cz.bezcisobe.backend.dto.mapper.UserMapper;
import cz.bezcisobe.backend.dto.request.LoginRequest;
import cz.bezcisobe.backend.dto.request.RegisterRequest;
import cz.bezcisobe.backend.dto.response.AuthResponse;
import cz.bezcisobe.backend.dto.response.UserResponse;
import cz.bezcisobe.backend.entity.Role;
import cz.bezcisobe.backend.entity.User;
import cz.bezcisobe.backend.exception.DuplicateResourceException;
import cz.bezcisobe.backend.exception.ResourceNotFoundException;
import cz.bezcisobe.backend.repository.UserRepository;
import cz.bezcisobe.backend.security.JwtTokenProvider;
import cz.bezcisobe.backend.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.debug("Login attempt for username='{}'", request.username());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        String token = tokenProvider.generateToken(
                userDetails.getId().toString(),
                userDetails.getUsername(),
                roles
        );

        log.info("User '{}' logged in successfully (roles={})", userDetails.getUsername(), roles);
        return new AuthResponse(token, userDetails.getId().toString(), userDetails.getUsername(), roles);
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            log.warn("Registration rejected: username '{}' already taken", request.username());
            throw new DuplicateResourceException("Uživatelské jméno již existuje");
        }
        if (userRepository.existsByEmail(request.email())) {
            log.warn("Registration rejected: email '{}' already taken", request.email());
            throw new DuplicateResourceException("Email již existuje");
        }

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .roles(Set.of(Role.ROLE_USER))
                .build();

        User saved = userRepository.save(user);
        log.info("New user registered: id={}, username='{}'", saved.getId(), saved.getUsername());
        return userMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Uživatel nenalezen"));
        return userMapper.toResponse(user);
    }
}
