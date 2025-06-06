package com.dwes.ApiRestBackEnd.repository;

import com.dwes.ApiRestBackEnd.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    @Query("select u from User u where u.username != 'admin' order by u.score desc")
    List<User> usersRanking();

    @Query("select u from User u where u.username != 'admin' order by u.score desc limit 3")
    List<User> usersRankingTop3();

    Optional<User> findByUsername(String username);
    
    Optional<User> findByUserEmail(String userEmail);
}
