package nsbm.dea.lms.progress_service.controller;


import nsbm.dea.lms.progress_service.entity.Question;
import nsbm.dea.lms.progress_service.service.QuectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/quection")
public class QuectionController {
    @Autowired
    QuectionService quectionService;

    @GetMapping("/get/all")
    public List<Question> get() {
        try {
            List<Question> allQuection = quectionService.getAllQuection();

            return allQuection;

        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
