package com.dwes.ApiRestBackEnd.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "videos")
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "MEDIUMTEXT", nullable = false)
    private String miniature;

    @Lob
    @Column(columnDefinition = "MEDIUMTEXT", nullable = false)
    private String video;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
            name = "username",
            referencedColumnName = "username",
            nullable = false
    )
    private User user;

    @Column(nullable = true)
    private Integer score; // Puntuación del 1 al 5, null si no ha sido puntuada

}