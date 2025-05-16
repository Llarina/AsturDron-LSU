package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.WeatherRequestDTO;
import com.dwes.ApiRestBackEnd.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/Weather")
public class WeatherController {
    private final WeatherService weatherService;

    @Autowired
    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping("")
    public List<WeatherRequestDTO> getWeatherDays(){
        return weatherService.getWeatherList();
    }
}
