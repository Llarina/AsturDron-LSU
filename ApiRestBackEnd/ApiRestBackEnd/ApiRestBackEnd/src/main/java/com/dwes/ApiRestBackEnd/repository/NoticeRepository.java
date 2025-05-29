package com.dwes.ApiRestBackEnd.repository;

import com.dwes.ApiRestBackEnd.model.License;
import com.dwes.ApiRestBackEnd.model.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    @Query("select distinct(n) from Notice n where n.license=?1")
    List<Notice> findNoticeByLicense(License license);
}
