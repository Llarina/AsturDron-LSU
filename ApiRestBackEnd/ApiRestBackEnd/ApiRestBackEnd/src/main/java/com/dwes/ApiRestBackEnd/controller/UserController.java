package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.RankingRequestDTO;
import com.dwes.ApiRestBackEnd.dto.UserRequestDTO;
import com.dwes.ApiRestBackEnd.model.User;
import com.dwes.ApiRestBackEnd.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/User")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping()
    public List<UserRequestDTO> getAllUsers(){
        return userService.showAllUsers();
    }

    @PostMapping()
    public User createUser(@RequestBody User user){
        return userService.createUser(user);
    }

    @PutMapping()
    public User updateUser(User user, Long id){
        return userService.updateUser(user,id);
    }


    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id){
        return userService.deleteUser(id);
    }

    @GetMapping("/Ranking")
    public List<RankingRequestDTO> getRanking(){
        return userService.getRanking();
    }

    @GetMapping("/RankingTop3")
    public List<RankingRequestDTO> getRankingTop3(){
        return userService.getRankingTop3();
    }

}
