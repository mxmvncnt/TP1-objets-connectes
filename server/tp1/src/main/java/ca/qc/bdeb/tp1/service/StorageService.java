package ca.qc.bdeb.tp1.service;

import ca.qc.bdeb.tp1.data.entity.Device;
import ca.qc.bdeb.tp1.data.entity.Video;
import ca.qc.bdeb.tp1.data.repository.DeviceRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.nio.file.attribute.BasicFileAttributes;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

@Service
public class StorageService {
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

    private String calculateMD5(Path filePath) throws IOException {
        try (InputStream inputStream = Files.newInputStream(filePath)) {
            return DigestUtils.md5DigestAsHex(inputStream);
        }
    }

    public Boolean validate(MultipartFile file) {
        return true;
    }
}
