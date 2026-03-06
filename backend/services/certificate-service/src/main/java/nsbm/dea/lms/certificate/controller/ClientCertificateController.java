package nsbm.dea.lms.certificate.controller;

import nsbm.dea.lms.certificate.dto.CertificateDTO;
import nsbm.dea.lms.certificate.service.CertificateService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/client/certificates")
public class ClientCertificateController {
    private final CertificateService service;
    public ClientCertificateController(CertificateService service) { this.service = service; }

    @GetMapping("/{username}")
    public List<CertificateDTO> getCertificatesByUser(@PathVariable String username) {
        return service.getCertificatesByUser(username);
    }
}