package ca.qc.bdeb.tp1.data.repository;

import ca.qc.bdeb.tp1.data.entity.Device;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
@Transactional
public interface DeviceRepository extends JpaRepository<Device, Integer>{

    @Modifying
    @Query("UPDATE Device d set d.isLost = :lostStatus WHERE d.id = :deviceId")
    void setLostStatus(@Param("deviceId") int deviceId, @Param("lostStatus") boolean lostStatus);

    @Modifying
    @Transactional
    @Query("UPDATE Device d set d.name = :newName WHERE d.id = :deviceId")
    void updateDeviceName(@Param("deviceId") int deviceId, @Param("newName") String newName);

    @Modifying
    @Transactional
    @Query("UPDATE Device d set d.location = :newLocation WHERE d.id = :deviceId")
    void updateDeviceLocation(@Param("deviceId") int deviceId, @Param("newLocation") String newLocation);
}