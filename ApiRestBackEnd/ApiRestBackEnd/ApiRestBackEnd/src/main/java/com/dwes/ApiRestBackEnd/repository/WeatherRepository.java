package com.dwes.ApiRestBackEnd.repository;

import com.dwes.ApiRestBackEnd.model.Weather;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeatherRepository extends JpaRepository<Weather,Long> {
    @Query(value = "select w from Weather w")
    List<Weather> findWeather(Pageable pageable);
}
