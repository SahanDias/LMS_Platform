package nsbm.dea.lms.quiz_service.dto;

import java.util.List;

/*
 Receives selected Question IDs from Admin UI
  Used In       : Assigning questions to a specific Quiz
  Example JSON  :
      {
         "questionIds": [1, 2, 5, 8]
      }
*/

public class SelectQuestionsRequest {

    // ATTRIBUTES

    // List of question IDs selected for a quiz
    private List<Long> questionIds;


    // CONSTRUCTORS

    public SelectQuestionsRequest() { }


    // GETTERS and SETTERS

    public List<Long> getQuestionIds() {
        return questionIds;
    }

    public void setQuestionIds(List<Long> questionIds) {
        this.questionIds = questionIds;
    }

    // toString()

    @Override
    public String toString() {
        return "SelectQuestionsRequest{" +
                "questionIdsCount=" + (questionIds != null ? questionIds.size() : 0) +
                '}';
    }
}