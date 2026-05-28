package cz.bezcisobe.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.url}")
    private String appUrl;

    @Value("${app.mail.from}")
    private String fromAddress;

    @Value("${app.mail.log-only:false}")
    private boolean logOnly;

    public void sendVerificationEmail(String to, String token) {
        String link = buildUrl("/verify-email", token);
        String subject = "Bezci sobě – ověřte svou e-mailovou adresu";
        String body = """
                Vítejte v Bezci sobě!

                Pro dokončení registrace prosím ověřte svou e-mailovou adresu kliknutím na následující odkaz:

                %s

                Odkaz je platný 24 hodin. Pokud jste se neregistrovali, tento e-mail prostě ignorujte.

                Děkujeme,
                tým Bezci sobě
                """.formatted(link);
        send(to, subject, body);
    }

    public void sendPasswordResetEmail(String to, String token) {
        String link = buildUrl("/reset-password", token);
        String subject = "Bezci sobě – obnovení hesla";
        String body = """
                Obdrželi jsme žádost o obnovení hesla pro váš účet.

                Nové heslo si můžete nastavit kliknutím na následující odkaz:

                %s

                Odkaz je platný 1 hodinu. Pokud jste o obnovení nežádali, tento e-mail můžete ignorovat – heslo zůstane beze změny.

                Tým Bezci sobě
                """.formatted(link);
        send(to, subject, body);
    }

    private void send(String to, String subject, String body) {
        if (logOnly) {
            log.info("[MAIL log-only] To: {} | Subject: {}\n{}", to, subject, body);
            return;
        }
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(fromAddress);
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(body);
        try {
            mailSender.send(msg);
            log.info("Email sent to {} ({})", to, subject);
        } catch (Exception ex) {
            log.error("Failed to send email to {} ({}): {}", to, subject, ex.getMessage());
            throw ex;
        }
    }

    private String buildUrl(String path, String token) {
        String base = appUrl.endsWith("/") ? appUrl.substring(0, appUrl.length() - 1) : appUrl;
        String encoded = URLEncoder.encode(token, StandardCharsets.UTF_8);
        return URI.create(base + path + "?token=" + encoded).toString();
    }
}
