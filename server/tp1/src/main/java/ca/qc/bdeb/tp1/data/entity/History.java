package ca.qc.bdeb.tp1.data.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
@Table(name = "history")
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    @JoinColumn(name = "video_id", referencedColumnName = "id")
    private Video video;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "start")
    private Date start;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "end")
    private Date end;

}
