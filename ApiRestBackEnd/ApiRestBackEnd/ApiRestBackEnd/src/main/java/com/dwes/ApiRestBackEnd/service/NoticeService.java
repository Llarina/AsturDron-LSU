package com.dwes.ApiRestBackEnd.service;

import com.dwes.ApiRestBackEnd.dto.NoticeCreateDTO;
import com.dwes.ApiRestBackEnd.dto.NoticeRequestDTO;
import com.dwes.ApiRestBackEnd.model.License;
import com.dwes.ApiRestBackEnd.model.Notice;
import com.dwes.ApiRestBackEnd.model.User;
import com.dwes.ApiRestBackEnd.repository.NoticeRepository;
import com.dwes.ApiRestBackEnd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Autowired
    public NoticeService(NoticeRepository noticeRepository, UserRepository userRepository, FileStorageService fileStorageService) {
        this.noticeRepository = noticeRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    public NoticeRequestDTO mapToRequestDTO(Notice notice){
       return NoticeRequestDTO.builder()
               .id(notice.getId())
               .titular(notice.getTitular())
               .notice(notice.getNotice())
               .dateYear(notice.getDateYear())
               .miniature(fileStorageService.getFullUrl(notice.getMiniature()))
               .license(notice.getLicense())
               .username(notice.getUser().getUsername())
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

    @Transactional
    public Notice postNotice(NoticeCreateDTO noticeCreateDTO){
        // Crear nueva entidad Notice
        Notice notice = new Notice();
        notice.setTitular(noticeCreateDTO.getTitular());
        notice.setNotice(noticeCreateDTO.getNotice());
        notice.setDateYear(noticeCreateDTO.getDateYear());
        notice.setMiniature(noticeCreateDTO.getMiniature());
        notice.setLicense(noticeCreateDTO.getLicense());
        
        // Buscar el usuario admin o crear uno si no existe
        User adminUser = userRepository.findByUsername("admin")
                .orElseGet(() -> {
                    // Crear usuario admin si no existe
                    User newAdmin = new User();
                    newAdmin.setUsername("admin");
                    newAdmin.setUserEmail("admin@admin.com");
                    newAdmin.setPassword("admin");
                    newAdmin.setLicense(License.a1);
                    newAdmin.setScore(0);
                    return userRepository.save(newAdmin);
                });
        
        // Asignar el usuario admin a la notice
        notice.setUser(adminUser);
        
        return noticeRepository.save(notice);
    }

    @Transactional
    public Notice updateNotice(Long id, NoticeCreateDTO noticeCreateDTO) {
        // Buscar la notice existente
        Notice existingNotice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice no encontrada con ID: " + id));
        
        // Actualizar los campos
        existingNotice.setTitular(noticeCreateDTO.getTitular());
        existingNotice.setNotice(noticeCreateDTO.getNotice());
        existingNotice.setDateYear(noticeCreateDTO.getDateYear());
        existingNotice.setMiniature(noticeCreateDTO.getMiniature());
        existingNotice.setLicense(noticeCreateDTO.getLicense());
        
        return noticeRepository.save(existingNotice);
    }

    /**
     * Crear noticia con archivo de miniatura
     */
    @Transactional
    public Notice postNoticeWithFile(NoticeCreateDTO noticeCreateDTO, MultipartFile miniatureFile) throws IOException {
        // Crear nueva entidad Notice
        Notice notice = new Notice();
        notice.setTitular(noticeCreateDTO.getTitular());
        notice.setNotice(noticeCreateDTO.getNotice());
        notice.setDateYear(noticeCreateDTO.getDateYear());
        notice.setLicense(noticeCreateDTO.getLicense());
        
        // Procesar archivo de miniatura si se proporciona
        if (miniatureFile != null && !miniatureFile.isEmpty()) {
            String miniaturePath = fileStorageService.storeImage(miniatureFile);
            notice.setMiniature(miniaturePath);
        } else {
            notice.setMiniature("");
        }
        
        // Buscar el usuario admin o crear uno si no existe
        User adminUser = userRepository.findByUsername("admin")
                .orElseGet(() -> {
                    // Crear usuario admin si no existe
                    User newAdmin = new User();
                    newAdmin.setUsername("admin");
                    newAdmin.setUserEmail("admin@admin.com");
                    newAdmin.setPassword("admin");
                    newAdmin.setLicense(License.a1);
                    newAdmin.setScore(0);
                    return userRepository.save(newAdmin);
                });
        
        // Asignar el usuario admin a la notice
        notice.setUser(adminUser);
        
        return noticeRepository.save(notice);
    }

    /**
     * Actualizar noticia con archivo de miniatura
     */
    @Transactional
    public Notice updateNoticeWithFile(Long id, NoticeCreateDTO noticeCreateDTO, MultipartFile miniatureFile) throws IOException {
        // Buscar la notice existente
        Notice existingNotice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice no encontrada con ID: " + id));
        
        // Guardar la miniatura anterior para eliminarla si es un archivo local
        String oldMiniature = existingNotice.getMiniature();
        
        // Actualizar los campos básicos
        existingNotice.setTitular(noticeCreateDTO.getTitular());
        existingNotice.setNotice(noticeCreateDTO.getNotice());
        existingNotice.setDateYear(noticeCreateDTO.getDateYear());
        existingNotice.setLicense(noticeCreateDTO.getLicense());
        
        // Procesar archivo de miniatura si se proporciona
        if (miniatureFile != null && !miniatureFile.isEmpty()) {
            // Eliminar miniatura anterior si era un archivo local
            if (oldMiniature != null && !oldMiniature.isEmpty() && oldMiniature.startsWith("uploads/")) {
                fileStorageService.deleteFile(oldMiniature);
            }
            
            // Guardar nueva miniatura
            String miniaturePath = fileStorageService.storeImage(miniatureFile);
            existingNotice.setMiniature(miniaturePath);
        }
        // Si no se proporciona nuevo archivo, mantener el anterior
        
        return noticeRepository.save(existingNotice);
    }

    // Eliminar notice (actualizado para eliminar archivos)
    @Transactional
    public void deleteNotice(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice no encontrada"));
                
        // Eliminar archivo de miniatura si es un archivo local
        if (notice.getMiniature() != null && !notice.getMiniature().isEmpty() && 
            notice.getMiniature().startsWith("uploads/")) {
            fileStorageService.deleteFile(notice.getMiniature());
        }
        
        noticeRepository.deleteById(id);
    }
}
