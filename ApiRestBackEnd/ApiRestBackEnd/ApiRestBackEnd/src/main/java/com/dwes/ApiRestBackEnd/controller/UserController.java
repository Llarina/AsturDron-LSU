package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.RankingRequestDTO;
import com.dwes.ApiRestBackEnd.dto.UserRequestDTO;
import com.dwes.ApiRestBackEnd.model.License;
import com.dwes.ApiRestBackEnd.model.User;
import com.dwes.ApiRestBackEnd.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/User")
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping()
    public List<User> getAllUsers(){
        return userService.showAllUsers();
    }

    @GetMapping("/dto")
    public List<UserRequestDTO> getAllUsersDTO(){
        return userService.showAllUsersDTO();
    }

    @PostMapping()
    public User createUser(@RequestBody User user){
        return userService.createUser(user);
    }

    @DeleteMapping("/username/{username}")
    public ResponseEntity<Void> deleteUserByUsername(@PathVariable String username){
        userService.deleteUserByUsername(username);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/ranking")
    public List<RankingRequestDTO> getRankingLowercase(){
        return userService.getRanking();
    }

    @GetMapping("/ranking/top3")
    public List<RankingRequestDTO> getRankingTop3Lowercase(){
        return userService.getRankingTop3();
    }

}
