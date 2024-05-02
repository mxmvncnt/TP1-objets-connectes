package ca.qc.bdeb.tp1.data.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "playlist")
public class Playlist {
    @Id
    @GeneratedValue
    private int id;

    @OneToOne
    @JoinColumn(name = "video_id", referencedColumnName = "id")
    private Video video;

    @Column(name = "position")
    private int position;
}
