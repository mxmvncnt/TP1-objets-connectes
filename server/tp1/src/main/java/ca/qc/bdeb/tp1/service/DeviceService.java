package ca.qc.bdeb.tp1.service;

import ca.qc.bdeb.tp1.data.entity.Device;
import ca.qc.bdeb.tp1.data.entity.Video;
import ca.qc.bdeb.tp1.data.repository.DeviceRepository;
import ca.qc.bdeb.tp1.data.repository.VideoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeviceService {
    private final DeviceRepository deviceRepository;
    private final VideoRepository videoRepository;

    public DeviceService(
            DeviceRepository repository,
            VideoRepository videoRepository) {
        this.deviceRepository = repository;
        this.videoRepository = videoRepository;
    }

    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    public Device getDeviceFromId(int id) {
        return deviceRepository.findById(id).get();
    }

    public void setDeviceLost(int deviceId, boolean lostStatus) {
        deviceRepository.setLostStatus(deviceId, lostStatus);
    }

    public List<Video> getVideosFromId(List<Integer> videoIds) {
        return videoRepository.findAllById(videoIds);
    }

    public void updateDeviceName(int deviceId, String newName) { deviceRepository.updateDeviceName(deviceId, newName); }

    public void updateDeviceLocation(int deviceId, String newLocation) { deviceRepository.updateDeviceLocation(deviceId, newLocation); }
}
