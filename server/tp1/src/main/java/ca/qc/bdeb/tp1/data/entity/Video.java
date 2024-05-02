package ca.qc.bdeb.tp1.data.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "video")
public class Video {
    @Id
    @GeneratedValue
    private int id;

    @OneToOne
    @JoinColumn(name = "device_id", referencedColumnName = "id")
    private Device device;

    @Column(name = "file")
    private String file;

    @Column(name = "size")
    private int size;

    @Column(name = "md5")
    private String md5;
}
