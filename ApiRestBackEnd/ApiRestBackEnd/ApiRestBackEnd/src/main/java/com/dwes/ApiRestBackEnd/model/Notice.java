package com.dwes.ApiRestBackEnd.model;

import com.dwes.ApiRestBackEnd.model.License;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "notices")
public class Notice {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String miniature;

        @Column(nullable = false)
        private String titular;

        @Column(nullable = false, columnDefinition = "TEXT")
        private String notice;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        private License license;

        @Column(nullable = false)
        private String dateYear;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", nullable = false)
        private User user;
}
