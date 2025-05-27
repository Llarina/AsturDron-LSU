package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.NoticeRequestDTO;
import com.dwes.ApiRestBackEnd.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Notice")
public class NoticeController {
    private final NoticeService noticeService;

    @Autowired
    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping("")
    public List<NoticeRequestDTO> getNoticesByLicense(@RequestParam String license){
        return noticeService.getNotices(license);
    }
}
