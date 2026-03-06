package nsbm.dea.lms.video;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"nsbm.dea.lms.video", "com.lms.videoservice"})
@EntityScan(basePackages = {"nsbm.dea.lms.video", "com.lms.videoservice.entity"})
@EnableJpaRepositories(basePackages = {"nsbm.dea.lms.video", "com.lms.videoservice.repository"})
public class LmsVideoServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(LmsVideoServiceApplication.class, args);
	}

}
