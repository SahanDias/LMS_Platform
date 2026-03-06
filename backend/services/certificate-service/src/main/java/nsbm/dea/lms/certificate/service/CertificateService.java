package nsbm.dea.lms.certificate.service;

import nsbm.dea.lms.certificate.dto.CertificateDTO;
import nsbm.dea.lms.certificate.entity.Certificate;
import nsbm.dea.lms.certificate.exception.ResourceNotFoundException;
import nsbm.dea.lms.certificate.repository.CertificateRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CertificateService {
    private final CertificateRepository repository;
    public CertificateService(CertificateRepository repository) { this.repository = repository; }

    public List<CertificateDTO> getAllCertificates() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public CertificateDTO getCertificateById(UUID id) {
        Certificate c = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
        return toDTO(c);
    }

    public List<CertificateDTO> getCertificatesByUser(String issuedTo) {
        return repository.findByIssuedTo(issuedTo).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public CertificateDTO createCertificate(CertificateDTO dto) {
        Certificate c = new Certificate();
        c.setTitle(dto.getTitle());
        c.setCourseId(dto.getCourseId());
        c.setCourseName(dto.getCourseName());
        c.setIssuedTo(dto.getIssuedTo());
        c.setIssuedAt(dto.getIssuedAt());
        c.setExpiresAt(dto.getExpiresAt());
        c.setStatus(dto.getStatus());
        return toDTO(repository.save(c));
    }

    public CertificateDTO updateCertificate(UUID id, CertificateDTO dto) {
        Certificate c = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
        c.setTitle(dto.getTitle());
        c.setCourseId(dto.getCourseId());
        c.setCourseName(dto.getCourseName());
        c.setIssuedTo(dto.getIssuedTo());
        c.setIssuedAt(dto.getIssuedAt());
        c.setExpiresAt(dto.getExpiresAt());
        c.setStatus(dto.getStatus());
        return toDTO(repository.save(c));
    }

    public void deleteCertificate(UUID id) {
        Certificate c = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Certificate not found"));
        repository.delete(c);
    }

    private CertificateDTO toDTO(Certificate c) {
        CertificateDTO dto = new CertificateDTO();
        dto.setId(c.getId());
        dto.setTitle(c.getTitle());
        dto.setCourseId(c.getCourseId());
        dto.setCourseName(c.getCourseName());
        dto.setIssuedTo(c.getIssuedTo());
        dto.setIssuedAt(c.getIssuedAt());
        dto.setExpiresAt(c.getExpiresAt());
        dto.setStatus(c.getStatus());
        return dto;
    }
}