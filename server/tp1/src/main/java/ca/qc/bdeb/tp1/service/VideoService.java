package ca.qc.bdeb.tp1.service;

import ca.qc.bdeb.tp1.data.entity.Video;
import ca.qc.bdeb.tp1.data.repository.VideoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VideoService {
    private final VideoRepository repository;

    public VideoService(VideoRepository repository) {
        this.repository = repository;
    }

    public void addVideo(Video video) {
        repository.save(video);
    }

    public List<Video> getAllVideos() {
        return repository.findAll();
    }
}
