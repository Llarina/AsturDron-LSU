package com.dwes.ApiRestBackEnd.service;

import com.dwes.ApiRestBackEnd.dto.WeatherRequestDTO;
import com.dwes.ApiRestBackEnd.model.Weather;
import com.dwes.ApiRestBackEnd.repository.WeatherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WeatherService {
    private final WeatherRepository weatherRepository;

    @Autowired
    public WeatherService(WeatherRepository weatherRepository) {
        this.weatherRepository = weatherRepository;
    }

    public WeatherRequestDTO mapToRequestDTO(Weather weather){
        return WeatherRequestDTO.builder()
                .weekDay(weather.getWeekDay())
                .day(weather.getNumberDay())
                .weather(weather.getWeather())
                .build();
    }

    @Transactional(readOnly = true)
    public List<WeatherRequestDTO> getWeatherList(){
        /*List<Weather> weatherList = (List<Weather>) weatherRepository.findWeather(PageRequest.of(0, 4));
        return weatherList.stream().map(this::mapToRequestDTO).collect(Collectors.toList());*/
        List<Weather> allWeather = weatherRepository.findAll();

        LocalDate startDate = LocalDate.of(2025, 5, 27);
        long daysPassed = ChronoUnit.DAYS.between(startDate, LocalDate.now());

        int start = (int) Math.min(daysPassed, allWeather.size() - 1);
        int end = (int) Math.min(start + 4, allWeather.size());

        return allWeather.subList(start, end).stream().map(this::mapToRequestDTO).collect(Collectors.toList());
    }



}
