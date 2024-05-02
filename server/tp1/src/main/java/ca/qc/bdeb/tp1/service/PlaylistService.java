package ca.qc.bdeb.tp1.service;

import ca.qc.bdeb.tp1.data.entity.Playlist;
import ca.qc.bdeb.tp1.data.entity.Video;
import ca.qc.bdeb.tp1.data.repository.PlaylistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaylistService {
    private final PlaylistRepository repository;

    public PlaylistService(PlaylistRepository repository) {
        this.repository = repository;
    }

    public List<Playlist> getAllPlaylists() {
        return repository.findAll();
    }

    public List<Video> getPlaylist(int deviceId) {
        return repository.getPlaylistByDeviceId(deviceId);
    }
}
