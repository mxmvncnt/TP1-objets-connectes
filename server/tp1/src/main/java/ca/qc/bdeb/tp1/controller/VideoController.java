package ca.qc.bdeb.tp1.controller;

import ca.qc.bdeb.tp1.data.entity.Video;
import ca.qc.bdeb.tp1.service.DeviceService;
import ca.qc.bdeb.tp1.service.PlaylistService;
import ca.qc.bdeb.tp1.service.StorageService;
import ca.qc.bdeb.tp1.service.VideoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin()
@RestController
public class VideoController {
    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @GetMapping("/videos/all")
    public List<Video> getAllDevices() {
        return videoService.getAllVideos();
    }
}
