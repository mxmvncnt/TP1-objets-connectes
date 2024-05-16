package ca.qc.bdeb.tp1.data.repository;

import ca.qc.bdeb.tp1.data.entity.Device;
import ca.qc.bdeb.tp1.data.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Integer>{
    boolean existsByFileAndSizeAndMd5(String file, int size, String md5);
    Video findByFileAndMd5(String file, String md5);
    List<Video> findAllByMd5In(List<String> md5);
    List<Video> findAllByFileIn(List<String> file);
}