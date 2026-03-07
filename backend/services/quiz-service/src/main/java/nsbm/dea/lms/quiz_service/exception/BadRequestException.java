package nsbm.dea.lms.quiz_service.exception;

/*
 Custom Runtime Exception
 Thrown when invalid or incorrect request
                  data is received from client/admin
  Example Use   :
      - Passing score greater than 100
      - No correct answer selected
      - Invalid attempt count
      - Question list empty
*/

public class BadRequestException extends RuntimeException {

    // CONSTRUCTORS

    // Constructor with custom error message

    public BadRequestException(String message) {
        super(message);
    }
}