package ca.qc.bdeb.tp1.data.repository;

import ca.qc.bdeb.tp1.data.entity.Playlist;
import ca.qc.bdeb.tp1.data.entity.Video;
import ca.qc.bdeb.tp1.data.entity.VideoWithPosition;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Integer>{
//    @Query("SELECT p.video FROM Playlist p WHERE p.device.id = :deviceId ORDER BY p.position")
//    List<Video> getPlaylistByDeviceId(@Param("deviceId") int deviceId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Playlist p WHERE p.device.id = :deviceId AND p.video.id = :videoId")
    void deleteVideoFromPlaylist(@Param("deviceId") int deviceId, @Param("videoId") int videoId);

    @Query("SELECT MAX(p.position) FROM Playlist p WHERE p.device.id = :deviceId")
    Integer getHighestPosition(@Param("deviceId") int deviceId);

    @Transactional
    @Modifying
    @Query("UPDATE Playlist p SET p.position = :position WHERE p.video.id = :videoID AND p.device.id = :deviceId")
    void updateVideoPosition(@Param("position") int position, @Param("videoID") int videoID, @Param("deviceId") int deviceId);

    @Query("SELECT new ca.qc.bdeb.tp1.data.entity.VideoWithPosition(v.id, v.file, v.size, v.md5, p.position) " +
            "FROM Playlist p JOIN p.video v WHERE p.device.id = :deviceId ORDER BY p.position")
    List<VideoWithPosition> getPlaylistByDeviceId(@Param("deviceId") int deviceId);
}