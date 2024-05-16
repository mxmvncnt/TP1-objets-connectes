package ca.qc.bdeb.tp1.service;

import ca.qc.bdeb.tp1.controller.ApiError;
import ca.qc.bdeb.tp1.data.entity.Device;
import ca.qc.bdeb.tp1.data.entity.Playlist;
import ca.qc.bdeb.tp1.data.entity.Video;
import ca.qc.bdeb.tp1.data.entity.VideoWithPosition;
import ca.qc.bdeb.tp1.data.repository.DeviceRepository;
import ca.qc.bdeb.tp1.data.repository.PlaylistRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlaylistService {
    private final PlaylistRepository playlistRepository;
    private final DeviceRepository deviceRepository;

    public PlaylistService(PlaylistRepository repository, DeviceRepository deviceRepository) {
        this.playlistRepository = repository;
        this.deviceRepository = deviceRepository;
    }

    public List<Playlist> getAllPlaylists() {
        return playlistRepository.findAll();
    }

    public List<VideoWithPosition> getPlaylist(int deviceId) {
        return playlistRepository.getPlaylistByDeviceId(deviceId);
    }

    public void deleteVideoFromPlaylist(int deviceId, int videoId) {
        playlistRepository.deleteVideoFromPlaylist(deviceId, videoId);
    }

    public void addToPlaylist(int deviceId, Video video) throws ApiError {
        Optional<Device> device = deviceRepository.findById(deviceId);

        if (device.isEmpty()) {
            throw new ApiError("", "", HttpStatus.NOT_FOUND);
        }
        Integer position = 1;
        Integer value = playlistRepository.getHighestPosition(deviceId);
        if (value != null) {
            position = value + 1;
        }

        Playlist playlist = new Playlist();
        playlist.setVideo(video);
        playlist.setDevice(device.get());
        playlist.setPosition(position);
        playlistRepository.save(playlist);
    }

    public void updateVideoPosition(int position, int videoId, int deviceId) {
        playlistRepository.updateVideoPosition(position, videoId, deviceId);
    }
}
