package progress.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class QuizDto {
    private  int id  ;
    private  int course_id ;
    private String title  ;
    private  int total_marks ;
}
