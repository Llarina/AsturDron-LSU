package com.dwes.ApiRestBackEnd.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "notices")

public class Notice {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        private Long id;
        @Column(name = "titular")
        private String titular;
        @Column(name = "notice")
        private String notice;
        @Column(name = "license")
        private String license;
        @Column(name = "dateYear")
        private String dateYear;


}
