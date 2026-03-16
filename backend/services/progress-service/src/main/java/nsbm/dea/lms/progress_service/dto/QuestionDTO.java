package nsbm.dea.lms.progress_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class QuestionDTO {
    private Long questionId;
    private Long courseId;
    private Long classId;
    private String questionText;
}
