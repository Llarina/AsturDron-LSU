package com.dwes.ApiRestBackEnd.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WeatherRequestDTO {
    private String weekDay;
    private int day;
    private String weather;
}
