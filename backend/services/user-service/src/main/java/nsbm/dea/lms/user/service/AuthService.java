package nsbm.dea.lms.user.service;

import nsbm.dea.lms.user.dto.AuthResponse;
import nsbm.dea.lms.user.dto.LoginRequest;
import nsbm.dea.lms.user.dto.RegisterRequest;
import nsbm.dea.lms.user.entity.Role;
import nsbm.dea.lms.user.entity.User;
import nsbm.dea.lms.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFirstName(),
                request.getLastName(),
                Role.STUDENT
        );

        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails, Map.of(
                "role", user.getRole().name(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName()
        ));

        return new AuthResponse(token, user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails, Map.of(
                "role", user.getRole().name(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName()
        ));

        return new AuthResponse(token, user.getEmail(), user.getFirstName(), user.getLastName(), user.getRole().name());
    }
}
