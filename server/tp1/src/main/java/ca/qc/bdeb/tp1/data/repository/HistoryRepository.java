package ca.qc.bdeb.tp1.data.repository;

import ca.qc.bdeb.tp1.data.entity.History;
import ca.qc.bdeb.tp1.data.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<History, Integer>{
    List<History> findByDevice_Id(Integer deviceId);
}