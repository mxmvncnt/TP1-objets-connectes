package ca.qc.bdeb.tp1.data.repository;

import ca.qc.bdeb.tp1.data.entity.Playlist;
import ca.qc.bdeb.tp1.data.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Integer>{
    @Query("SELECT p.video FROM Playlist p WHERE p.device.id = :deviceId ORDER BY p.position")
    List<Video> getPlaylistByDeviceId(@Param("deviceId") int deviceId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Playlist p WHERE p.device.id = :deviceId AND p.video.id = :videoId")
    void deleteVideoFromPlaylist(@Param("deviceId") int deviceId, @Param("videoId") int videoId);

    @Query("SELECT p.position FROM Playlist p ORDER BY p.position LIMIT 1")
    int getHighestPosition();
}