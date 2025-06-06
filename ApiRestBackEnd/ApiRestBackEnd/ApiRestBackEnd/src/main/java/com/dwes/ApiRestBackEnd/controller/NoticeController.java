package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.NoticeCreateDTO;
import com.dwes.ApiRestBackEnd.dto.NoticeRequestDTO;
import com.dwes.ApiRestBackEnd.dto.UploadResponseDTO;
import com.dwes.ApiRestBackEnd.model.License;
import com.dwes.ApiRestBackEnd.model.Notice;
import com.dwes.ApiRestBackEnd.service.NoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @GetMapping("/license/{license}")
    public List<NoticeRequestDTO> getNoticesByLicensePath(@PathVariable String license) {
        License licenseEnum;
        try {
            licenseEnum = License.valueOf(license.toLowerCase());
        } catch (IllegalArgumentException e) {
            licenseEnum = License.any; // Default fallback
        }
        return noticeService.getNotices(licenseEnum);
    }

    @PostMapping()
    public ResponseEntity<?> postNotice(@RequestBody NoticeCreateDTO noticeCreateDTO){
        try {
            Notice createdNotice = noticeService.postNotice(noticeCreateDTO);
            NoticeRequestDTO responseDto = noticeService.mapToRequestDTO(createdNotice);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear la notice: " + e.getMessage());
        }
    }

    @PostMapping("/upload-file")
    public ResponseEntity<UploadResponseDTO> postNoticeWithFile(
            @RequestParam("titular") String titular,
            @RequestParam("notice") String notice,
            @RequestParam("dateYear") String dateYear,
            @RequestParam("license") String license,
            @RequestParam(value = "miniatureFile", required = false) MultipartFile miniatureFile
    ) {
        try {
            NoticeCreateDTO noticeCreateDTO = NoticeCreateDTO.builder()
                    .titular(titular)
                    .notice(notice)
                    .dateYear(dateYear)
                    .license(License.valueOf(license.toLowerCase()))
                    .build();

            Notice createdNotice = noticeService.postNoticeWithFile(noticeCreateDTO, miniatureFile);
            
            UploadResponseDTO response = UploadResponseDTO.builder()
                    .success(true)
                    .message("Noticia creada exitosamente")
                    .id(createdNotice.getId())
                    .url(createdNotice.getMiniature())
                    .build();
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            UploadResponseDTO response = UploadResponseDTO.builder()
                    .success(false)
                    .message("Error al procesar el archivo: " + e.getMessage())
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (RuntimeException e) {
            UploadResponseDTO response = UploadResponseDTO.builder()
                    .success(false)
                    .message("Error: " + e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNotice(@PathVariable Long id, @RequestBody NoticeCreateDTO noticeCreateDTO){
        try {
            Notice updatedNotice = noticeService.updateNotice(id, noticeCreateDTO);
            NoticeRequestDTO responseDto = noticeService.mapToRequestDTO(updatedNotice);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la notice: " + e.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.noContent().build();
    }
}
