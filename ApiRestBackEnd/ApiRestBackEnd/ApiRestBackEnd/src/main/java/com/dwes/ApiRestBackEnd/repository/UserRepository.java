package com.dwes.ApiRestBackEnd.repository;

import com.dwes.ApiRestBackEnd.dto.RankingRequestDTO;
import com.dwes.ApiRestBackEnd.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    @Query("select u from User u order by u.score desc")
    List<User> usersRanking();
}
