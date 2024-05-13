package ca.qc.bdeb.tp1.service;

import ca.qc.bdeb.tp1.data.entity.Video;
import ca.qc.bdeb.tp1.data.repository.VideoRepository;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class StorageService {
    private final VideoService videoService;
    private final VideoRepository videoRepository;

    public StorageService(
            VideoService videoService,
            VideoRepository videoRepository) {
        this.videoService = videoService;
        this.videoRepository = videoRepository;
    }

    public void save(MultipartFile file) throws IOException {
        Path projectRootDir = Paths.get("").toAbsolutePath();

        Path folderPath = projectRootDir.resolve("saved_videos");
        Files.createDirectories(folderPath);

        if (file.getOriginalFilename() == null || file.getOriginalFilename().contains("..")) {
            throw new IllegalArgumentException("Invalid filename");
        }

        Path destinationPath = folderPath.resolve(file.getOriginalFilename());

        file.transferTo(destinationPath.toFile());
    }

    public Video getVideo(MultipartFile file) throws IOException {
        Path projectRootDir = Paths.get("").toAbsolutePath();
        Path folderPath = projectRootDir.resolve("saved_videos");

        if (file.getOriginalFilename() == null || file.getOriginalFilename().contains("..")) {
            throw new IllegalArgumentException("Invalid filename");
        }
        String fileName = file.getOriginalFilename();
        Path filePath = folderPath.resolve(fileName);

        Video video = new Video();

        video.setFile(fileName);
        video.setSize((int) file.getSize());
        video.setMd5(calculateMD5(filePath));
        return video;
    }

    public ResponseEntity<Resource> getFile(Integer videoId) throws IOException {
        Path projectRootDir = Paths.get("").toAbsolutePath();
        Path folderPath = projectRootDir.resolve("saved_videos");

        Video video = videoRepository.findById(videoId).get();

        Path videoPath = folderPath.resolve(video.getFile());

        ByteArrayResource content = new ByteArrayResource(Files.readAllBytes(videoPath));
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + videoPath.getFileName());

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(content);
    }

    private String calculateMD5(Path filePath) throws IOException {
        try (InputStream inputStream = Files.newInputStream(filePath)) {
            return DigestUtils.md5DigestAsHex(inputStream);
        }
    }

    public Boolean validate(MultipartFile file) {
        return true;
    }
}
