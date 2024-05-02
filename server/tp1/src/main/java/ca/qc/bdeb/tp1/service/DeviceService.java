package ca.qc.bdeb.tp1.service;

import ca.qc.bdeb.tp1.data.entity.Device;
import ca.qc.bdeb.tp1.data.repository.DeviceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeviceService {
    private final DeviceRepository repository;

    public DeviceService(DeviceRepository repository) {
        this.repository = repository;
    }

    public List<Device> getAllDevices() {
        return repository.findAll();
    }
}
