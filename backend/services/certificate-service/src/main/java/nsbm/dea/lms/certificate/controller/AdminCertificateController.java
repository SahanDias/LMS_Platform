package nsbm.dea.lms.certificate.controller;

import nsbm.dea.lms.certificate.dto.CertificateDTO;
import nsbm.dea.lms.certificate.service.CertificateService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/certificates")
public class AdminCertificateController {
    private final CertificateService service;
    public AdminCertificateController(CertificateService service) { this.service = service; }

    @GetMapping
    public List<CertificateDTO> getAll() { return service.getAllCertificates(); }

    @GetMapping("/{id}")
    public CertificateDTO getById(@PathVariable UUID id) { return service.getCertificateById(id); }

    @PostMapping
    public CertificateDTO create(@RequestBody CertificateDTO dto) { return service.createCertificate(dto); }

    @PutMapping("/{id}")
    public CertificateDTO update(@PathVariable UUID id, @RequestBody CertificateDTO dto) { return service.updateCertificate(id, dto); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) { service.deleteCertificate(id); }
}