package ca.qc.bdeb.tp1.service;

import ca.qc.bdeb.tp1.data.entity.History;
import ca.qc.bdeb.tp1.data.entity.Video;
import ca.qc.bdeb.tp1.data.repository.HistoryRepository;
import ca.qc.bdeb.tp1.data.repository.VideoRepository;
import org.springframework.data.repository.support.Repositories;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class HistoryService {
    private final HistoryRepository historyRepository;

    public HistoryService(HistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    public List<History> getHistoryEntries(Integer deviceId) {
        return historyRepository.findByDevice_Id(deviceId);
    }
}
