package cz.bezcisobe.backend.service;

import cz.bezcisobe.backend.dto.mapper.UserMapper;
import cz.bezcisobe.backend.dto.request.LoginRequest;
import cz.bezcisobe.backend.dto.request.RegisterRequest;
import cz.bezcisobe.backend.dto.response.AuthResponse;
import cz.bezcisobe.backend.dto.response.UserResponse;
import cz.bezcisobe.backend.entity.PasswordResetToken;
import cz.bezcisobe.backend.entity.Role;
import cz.bezcisobe.backend.entity.User;
import cz.bezcisobe.backend.entity.VerificationToken;
import cz.bezcisobe.backend.exception.BadRequestException;
import cz.bezcisobe.backend.exception.DuplicateResourceException;
import cz.bezcisobe.backend.exception.ResourceNotFoundException;
import cz.bezcisobe.backend.repository.PasswordResetTokenRepository;
import cz.bezcisobe.backend.repository.UserRepository;
import cz.bezcisobe.backend.repository.VerificationTokenRepository;
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

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private static final long VERIFICATION_TTL_HOURS = 24;
    private static final long RESET_TTL_HOURS = 1;

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final UserMapper userMapper;
    private final EmailService emailService;

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

        String lang = request.language() == null || request.language().isBlank() ? "cs" : request.language();
        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .language(lang)
                .emailVerified(false)
                .roles(Set.of(Role.ROLE_USER))
                .build();

        User saved = userRepository.save(user);
        issueVerificationToken(saved);
        log.info("New user registered (pending verification): id={}, username='{}'", saved.getId(), saved.getUsername());
        return userMapper.toResponse(saved);
    }

    @Transactional
    public void verifyEmail(String token) {
        VerificationToken vt = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Neplatný ověřovací odkaz"));

        if (vt.isUsed()) {
            throw new BadRequestException("Tento ověřovací odkaz již byl použit");
        }
        if (vt.isExpired()) {
            throw new BadRequestException("Ověřovací odkaz vypršel. Vyžádejte si nový.");
        }

        User user = vt.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        vt.setUsed(true);
        verificationTokenRepository.save(vt);
        log.info("Email verified for user id={}, username='{}'", user.getId(), user.getUsername());
    }

    /**
     * Issues a fresh verification token for an unverified user. Silent if the email
     * is unknown OR if the account is already verified so we don't leak account state.
     */
    @Transactional
    public void resendVerification(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            log.debug("Resend-verification requested for unknown email '{}', responding silently", email);
            return;
        }
        User user = userOpt.get();
        if (user.isEmailVerified()) {
            log.debug("Resend-verification requested for already-verified user '{}', responding silently", user.getUsername());
            return;
        }
        issueVerificationToken(user);
    }

    /**
     * Always responds the same way regardless of whether the email exists, so we
     * don't help attackers enumerate accounts.
     */
    @Transactional
    public void requestPasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            log.debug("Password-reset requested for unknown email '{}', responding silently", email);
            return;
        }
        User user = userOpt.get();
        passwordResetTokenRepository.deleteAllForUser(user);

        String token = UUID.randomUUID().toString();
        PasswordResetToken prt = PasswordResetToken.builder()
                .user(user)
                .token(token)
                .expiresAt(Instant.now().plus(RESET_TTL_HOURS, ChronoUnit.HOURS))
                .build();
        passwordResetTokenRepository.save(prt);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
        log.info("Password-reset email sent to user id={}, username='{}'", user.getId(), user.getUsername());
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken prt = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Neplatný odkaz pro obnovení hesla"));

        if (prt.isUsed()) {
            throw new BadRequestException("Tento odkaz pro obnovení hesla již byl použit");
        }
        if (prt.isExpired()) {
            throw new BadRequestException("Odkaz pro obnovení hesla vypršel. Vyžádejte si nový.");
        }

        User user = prt.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        // A successful password reset also implies email ownership — verify the account
        // so a user who never clicked the original verification link is not locked out.
        user.setEmailVerified(true);
        userRepository.save(user);

        prt.setUsed(true);
        passwordResetTokenRepository.save(prt);
        log.info("Password reset for user id={}, username='{}'", user.getId(), user.getUsername());
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Uživatel nenalezen"));
        return userMapper.toResponse(user);
    }

    private void issueVerificationToken(User user) {
        verificationTokenRepository.deleteAllForUser(user);
        String token = UUID.randomUUID().toString();
        VerificationToken vt = VerificationToken.builder()
                .user(user)
                .token(token)
                .expiresAt(Instant.now().plus(VERIFICATION_TTL_HOURS, ChronoUnit.HOURS))
                .build();
        verificationTokenRepository.save(vt);
        emailService.sendVerificationEmail(user.getEmail(), token);
    }
}
