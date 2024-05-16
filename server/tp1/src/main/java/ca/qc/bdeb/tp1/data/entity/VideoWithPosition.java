package ca.qc.bdeb.tp1.data.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VideoWithPosition {
    private int id;
    private String file;
    private int size;
    private String md5;
    private int position;

    public VideoWithPosition(int id, String file, int size, String md5, int position) {
        this.id = id;
        this.file = file;
        this.size = size;
        this.md5 = md5;
        this.position = position;
    }
}
