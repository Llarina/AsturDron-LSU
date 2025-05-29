package com.dwes.ApiRestBackEnd.controller;

import com.dwes.ApiRestBackEnd.dto.RankingRequestDTO;
import com.dwes.ApiRestBackEnd.dto.UserRequestDTO;
import com.dwes.ApiRestBackEnd.model.License;
import com.dwes.ApiRestBackEnd.model.User;
import com.dwes.ApiRestBackEnd.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public List<UserRequestDTO> getAllUsers(){
        return userService.showAllUsers();
    }

    @PostMapping()
    public User createUser(@RequestBody User user){
        return userService.createUser(user);
    }

    @PostMapping("/quick")
    public User quickCreateUser(@RequestParam String username) {
        User user = new User();
        user.setUsername(username);
        user.setUserEmail(username + "@example.com");
        user.setPassword("12345");
        user.setLicense(License.a1);
        user.setScore(0);
        return userService.createUser(user);
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
