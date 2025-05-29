package com.dwes.ApiRestBackEnd.service;

import com.dwes.ApiRestBackEnd.dto.NoticeRequestDTO;
import com.dwes.ApiRestBackEnd.model.License;
import com.dwes.ApiRestBackEnd.model.Notice;
import com.dwes.ApiRestBackEnd.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;

    @Autowired
    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    public NoticeRequestDTO mapToRequestDTO(Notice notice){
       return NoticeRequestDTO.builder()
               .titular(notice.getTitular())
               .notice(notice.getNotice())
               .dateYear(notice.getDateYear())
               .miniature(notice.getMiniature())
               .build();
    }

    @Transactional(readOnly = true)
    public List<NoticeRequestDTO> getAllNotices() {
        List<Notice> notices = noticeRepository.findAll();
        return notices.stream().map(this::mapToRequestDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NoticeRequestDTO> getNotices(License license){
        if (license == License.any) {
            return getAllNotices();
        }
        List<Notice> notices = noticeRepository.findNoticeByLicense(license);
        // Baraja la lista para obtener elementos aleatorios sin repeticiones
        Collections.shuffle(notices);
        // Toma los primeros 3 (o menos si hay menos de 3)
        List<Notice> noticesRd = notices.stream().limit(3).collect(Collectors.toList());
        return noticesRd.stream().map(this::mapToRequestDTO).collect(Collectors.toList());
    }
}
