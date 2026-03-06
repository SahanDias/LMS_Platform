package nsbm.dea.lms.enrollment.exception;


public final class WaitlistExceptions {

    private WaitlistExceptions() {}

    public static class NotFound extends RuntimeException {
        public NotFound(Long id) {
            super("Waitlist entry not found with id: " + id);
        }
    }
}
