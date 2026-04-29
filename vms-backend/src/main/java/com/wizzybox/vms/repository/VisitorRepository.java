package com.wizzybox.vms.repository;

import com.wizzybox.vms.entity.Visitor;
import com.wizzybox.vms.entity.VisitorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Long> {
    List<Visitor> findByStatus(VisitorStatus status);
    List<Visitor> findByCheckInTimeBetween(LocalDateTime from, LocalDateTime to);
    List<Visitor> findByDepartment(String department);
    long countByStatus(VisitorStatus status);
}
