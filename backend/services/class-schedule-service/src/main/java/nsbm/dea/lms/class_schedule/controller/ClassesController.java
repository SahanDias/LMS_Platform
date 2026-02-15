package nsbm.dea.lms.class_schedule.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import nsbm.dea.lms.class_schedule.dto.ClassesDTO;
import nsbm.dea.lms.class_schedule.entity.Classes;
import nsbm.dea.lms.class_schedule.service.ClassesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/classes/")
@RequiredArgsConstructor
public class ClassesController {
    private final ClassesService classesService;

    @PostMapping("/create-class")
    public ResponseEntity<Classes> createClass(@RequestBody ClassesDTO dto) {
        return new ResponseEntity<>(
                classesService.createClass(dto),
                HttpStatus.CREATED
        );
    }
}
