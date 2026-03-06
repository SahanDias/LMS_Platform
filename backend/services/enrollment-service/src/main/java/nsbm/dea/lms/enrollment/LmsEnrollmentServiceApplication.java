package nsbm.dea.lms.enrollment_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "nsbm.dea.lms")
@EnableJpaRepositories(basePackages = "nsbm.dea.lms.enrollment.repository")
@EntityScan(basePackages = "nsbm.dea.lms.enrollment.entity")
public class LmsEnrollmentServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(LmsEnrollmentServiceApplication.class, args);
	}

}
