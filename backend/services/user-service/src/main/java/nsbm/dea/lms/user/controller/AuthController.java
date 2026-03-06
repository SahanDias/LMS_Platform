package nsbm.dea.lms.user.controller;

import jakarta.validation.Valid;
import nsbm.dea.lms.user.dto.AuthResponse;
import nsbm.dea.lms.user.dto.LoginRequest;
import nsbm.dea.lms.user.dto.RegisterRequest;
import nsbm.dea.lms.user.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(201).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
