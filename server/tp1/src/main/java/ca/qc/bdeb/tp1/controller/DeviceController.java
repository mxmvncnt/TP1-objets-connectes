package ca.qc.bdeb.tp1.controller;

import ca.qc.bdeb.tp1.data.entity.Device;
import ca.qc.bdeb.tp1.data.entity.Video;
import ca.qc.bdeb.tp1.service.DeviceService;
import ca.qc.bdeb.tp1.service.PlaylistService;
import ca.qc.bdeb.tp1.service.StorageService;
import ca.qc.bdeb.tp1.service.VideoService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @PatchMapping("/devices/{deviceId}/playlist/{videoId}/{position}")
    public void updateVideoPosition(
            @PathVariable int position,
            @PathVariable int videoId,
            @PathVariable int deviceId) {
        playlistService.updateVideoPosition(position, videoId, deviceId);
    }

    @PatchMapping("/devices/{deviceId}/editName/{deviceNewName}/")
    public void updateDeviceName(
            @PathVariable int deviceId,
            @PathVariable String deviceNewName) {
        deviceService.updateDeviceName(deviceId, deviceNewName);
    }

    @PatchMapping("/devices/{deviceId}/editLocation/{deviceNewLocation}")
    public void updateDeviceLocation(
            @PathVariable int deviceId,
            @PathVariable String deviceNewLocation
    ) {
        deviceService.updateDeviceLocation(deviceId, deviceNewLocation);
    }

    /**
     * @param deviceId ID of the device
     * @param body     JSON Body: <br>
     *                 "is_playing": Boolean <br>
     *                 "videos": [ <br>
     *                 { <br>
     *                 "id": Integer, <br>
     *                 "start": String (Date), <br>
     *                 "end": String (Date) <br>
     *                 { <br>
     *                 ] <br>
     * @throws ParseException
     */
    @PostMapping("/devices/{deviceId}/status")
    public Map<String, Object> updateDeviceStatus(
            @PathVariable int deviceId,
            @RequestBody Map<String, Object> body) throws ParseException {
        Boolean isPlaying = (Boolean) body.get("is_playing");
        List<Map<String, Object>> videosMap = (List<Map<String, Object>>) body.get("videos");
        List<Video> videos = deviceService.getVideosFromId(videosMap.stream().filter(video -> video.get("id") != null).map(video -> (Integer) video.get("id")).toList());

        videoService.addHistoryEntries(videosMap, videos);

        Device device = deviceService.getDeviceFromId(deviceId);

        HashMap<String, Object> response = new HashMap<>();
        response.put("object_name", device.getName());
        response.put("object_location", device.getLocation());
        response.put("object_is_lost", device.isLost());
        response.put("videos", playlistService.getPlaylist(deviceId));

        return response;
    }

    @GetMapping("/videos/{videoId}/download")
    public ResponseEntity<Resource> getVideoFile(@PathVariable int videoId) throws IOException {
        return storageService.getFile(videoId);
    }

    @PostMapping("/devices/add/{deviceName}/{location}/{isLost}")
    public void addNewVideo(
            @PathVariable String deviceName,
            @PathVariable String location,
            @PathVariable boolean isLost) {
        Device device = new Device();
        device.setName(deviceName);
        device.setLocation(location);
        device.setLost(isLost);
        deviceService.createDevice(device);
    }
}
