package com.dwes.ApiRestBackEnd.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "weather")
public class Weather {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "week_day")
    private String weekDay;
    @Column(name = "number_day")
    private int day;
    @Column(name = "weather")
    private String weather;
}
