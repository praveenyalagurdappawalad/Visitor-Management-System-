package com.wizzybox.vms.repository;

import com.wizzybox.vms.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    @Query("SELECT AVG(f.rating) FROM Feedback f")
    Double findAverageRating();
}
