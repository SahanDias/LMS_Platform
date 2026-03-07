package nsbm.dea.lms.quiz_service.exception;

/*
  Custom Runtime Exception
  Thrown when requested entity not found
*/

public class ResourceNotFoundException extends RuntimeException {

    // CONSTRUCTOR

    public ResourceNotFoundException(String message) {
        super(message);
    }
}