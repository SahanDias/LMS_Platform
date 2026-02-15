package nsbm.dea.lms.class_schedule.service;

import lombok.RequiredArgsConstructor;
import nsbm.dea.lms.class_schedule.dto.ClassesDTO;
import nsbm.dea.lms.class_schedule.entity.Classes;
import nsbm.dea.lms.class_schedule.repository.ClassesRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClassesService {

    private final ClassesRepository classesRepository;
    private final ModelMapper modelMapper;

    public Classes createClass(ClassesDTO dto) {
        Classes classes = modelMapper.map(dto, Classes.class);
        return classesRepository.save(classes);
    }
}
