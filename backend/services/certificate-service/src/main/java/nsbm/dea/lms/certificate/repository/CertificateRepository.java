package nsbm.dea.lms.certificate.repository;

import nsbm.dea.lms.certificate.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CertificateRepository extends JpaRepository<Certificate, UUID> {
    List<Certificate> findByIssuedTo(String issuedTo);
}