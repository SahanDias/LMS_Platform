package nsbm.dea.lms.enrollment.service;

import nsbm.dea.lms.enrollment.dto.WaitlistDTO;
import nsbm.dea.lms.enrollment.entity.WaitlistEntry;
import nsbm.dea.lms.enrollment.exception.WaitlistExceptions;
import nsbm.dea.lms.enrollment.mapper.WaitlistMapper;
import nsbm.dea.lms.enrollment.repository.WaitlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WaitlistService {

    private final WaitlistRepository waitlistRepository;
    private final WaitlistMapper waitlistMapper;

    public WaitlistService(WaitlistRepository waitlistRepository, WaitlistMapper waitlistMapper) {
        this.waitlistRepository = waitlistRepository;
        this.waitlistMapper = waitlistMapper;
    }

    public WaitlistDTO createWaitlistEntry(WaitlistEntry entry) {
        int position = waitlistRepository.countByClassId(entry.getClassId()) + 1;
        entry.setPosition(position);
        return waitlistMapper.toDto(waitlistRepository.save(entry));
    }

    public List<WaitlistDTO> getWaitlistByStudent(Long studentId) {
        return waitlistRepository.findByStudentId(studentId).stream().map(waitlistMapper::toDto).toList();
    }

    public int getWaitlistPosition(Long entryId) {
        WaitlistEntry e = waitlistRepository.findById(entryId).orElseThrow(() -> new WaitlistExceptions.NotFound(entryId));
        return e.getPosition();
    }

    public void removeFromWaitlist(Long id) {
        if (!waitlistRepository.existsById(id)) throw new WaitlistExceptions.NotFound(id);
        waitlistRepository.deleteById(id);
    }
}
