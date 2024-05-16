package ca.qc.bdeb.tp1.data.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "video", uniqueConstraints = @UniqueConstraint(columnNames = {"file", "size", "md5"}))
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "file")
    private String file;

    @Column(name = "size")
    private int size;

    @Column(name = "md5")
    private String md5;
}
