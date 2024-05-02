package ca.qc.bdeb.tp1.controller;

import ca.qc.bdeb.tp1.data.entity.Device;
import ca.qc.bdeb.tp1.service.DeviceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DeviceController {
    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping("/devices")
    public List<Device> getAllDevices() {
        return deviceService.getAllDevices();
    }

}
