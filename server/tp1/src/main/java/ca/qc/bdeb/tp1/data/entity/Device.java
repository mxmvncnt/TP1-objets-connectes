package ca.qc.bdeb.tp1.data.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "device")
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "location")
    private String location;

    @Column(name = "is_lost")
    private boolean isLost;
}
