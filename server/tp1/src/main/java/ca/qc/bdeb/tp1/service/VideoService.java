package ca.qc.bdeb.tp1.service;

import ca.qc.bdeb.tp1.data.entity.History;
import ca.qc.bdeb.tp1.data.entity.Video;
import ca.qc.bdeb.tp1.data.repository.HistoryRepository;
import ca.qc.bdeb.tp1.data.repository.VideoRepository;
import org.springframework.data.repository.support.Repositories;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;

@Service
public class VideoService {
    private final VideoRepository videoRepository;
    private final HistoryRepository historyRepository;
    private final Repositories repositories;

    public VideoService(VideoRepository repository, HistoryRepository historyRepository, Repositories repositories) {
        this.videoRepository = repository;
        this.historyRepository = historyRepository;
        this.repositories = repositories;
    }

    public void addVideo(Video video) {
        videoRepository.save(video);
    }

    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    public void addHistoryEntries(List<Map<String, Object>> historyMap, List<Video> videos) throws ParseException {
        List<History> historyList = new ArrayList<>();

        for (int i = 0; i < videos.size(); i++) {


            SimpleDateFormat date = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
            History history = new History();
            Date start = date.parse(String.valueOf(historyMap.get(i).get("start")));
            Date end = date.parse(String.valueOf(historyMap.get(i).get("end")));

            history.setVideo(videos.get(i));
            history.setStart(start);
            history.setEnd(end);

            historyList.add(history);
        }

        historyRepository.saveAll(historyList);
    }
}
