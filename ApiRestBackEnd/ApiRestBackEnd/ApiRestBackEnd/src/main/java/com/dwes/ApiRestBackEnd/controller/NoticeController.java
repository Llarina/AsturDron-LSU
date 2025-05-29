package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.NoticeRequestDTO;
import com.dwes.ApiRestBackEnd.model.License;
import com.dwes.ApiRestBackEnd.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Notice")
@CrossOrigin(origins = "*")
public class NoticeController {
    private final NoticeService noticeService;

    @Autowired
    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping
    public List<NoticeRequestDTO> getAllNotices() {
        return noticeService.getAllNotices();
    }

    @GetMapping("/license")
    public List<NoticeRequestDTO> getNoticesByLicense(@RequestParam License license) {
        return noticeService.getNotices(license);
    }
}
