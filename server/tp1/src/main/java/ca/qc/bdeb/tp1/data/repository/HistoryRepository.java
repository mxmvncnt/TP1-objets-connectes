package ca.qc.bdeb.tp1.data.repository;

import ca.qc.bdeb.tp1.data.entity.History;
import ca.qc.bdeb.tp1.data.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoryRepository extends JpaRepository<History, Integer>{
}