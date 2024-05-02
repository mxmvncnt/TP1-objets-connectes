package ca.qc.bdeb.tp1.data.repository;

import ca.qc.bdeb.tp1.data.entity.Playlist;
import ca.qc.bdeb.tp1.data.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Integer>{
}