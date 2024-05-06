package ca.qc.bdeb.tp1.controller;

import ca.qc.bdeb.tp1.data.entity.Device;
import ca.qc.bdeb.tp1.data.entity.Video;
import ca.qc.bdeb.tp1.service.DeviceService;
import ca.qc.bdeb.tp1.service.PlaylistService;
import ca.qc.bdeb.tp1.service.StorageService;
import ca.qc.bdeb.tp1.service.VideoService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin()
@RestController
public class DeviceController {
    private final DeviceService deviceService;
    private final PlaylistService playlistService;
    private final StorageService storageService;
    private final VideoService videoService;

    public DeviceController(
            DeviceService deviceService,
            PlaylistService playlistService,
            StorageService storageService,
            VideoService videoService) {
        this.deviceService = deviceService;
        this.playlistService = playlistService;
        this.storageService = storageService;
        this.videoService = videoService;
    }

    @GetMapping("/devices")
    public List<Device> getAllDevices() {
        return deviceService.getAllDevices();
    }

    @GetMapping("/devices/{deviceId}/lost")
    public void lostDevice(
            @PathVariable int deviceId,
            @RequestParam boolean isLost) {
        deviceService.setDeviceLost(deviceId, isLost);
    }

    @GetMapping("/devices/{deviceId}/playlist")
    public List<Video> getPlaylist(
            @PathVariable int deviceId) {
        return playlistService.getPlaylist(deviceId);
    }

    @PostMapping("/devices/{deviceId}/video/add")
    public void addNewVideo(
            @PathVariable int deviceId,
            @RequestBody MultipartFile file) throws IOException {
        storageService.save(file);
        Video video = storageService.getVideo(file);
        videoService.addVideo(video);
        playlistService.addToPlaylist(deviceId, video);
    }

    @DeleteMapping("/devices/{deviceId}/playlist/{videoId}")
    public void removeVideoFromPlaylist(
            @PathVariable int deviceId,
            @PathVariable int videoId) {
        playlistService.deleteVideoFromPlaylist(deviceId, videoId);
    }
}
