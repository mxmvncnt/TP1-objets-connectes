package ca.qc.bdeb.tp1.data.repository;

import ca.qc.bdeb.tp1.data.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface DeviceRepository extends JpaRepository<Device, Integer>{
}