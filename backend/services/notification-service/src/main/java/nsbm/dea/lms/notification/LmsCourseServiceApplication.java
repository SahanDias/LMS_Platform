package nsbm.dea.lms.notification;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LmsCourseServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(LmsCourseServiceApplication.class, args);
	}

}
