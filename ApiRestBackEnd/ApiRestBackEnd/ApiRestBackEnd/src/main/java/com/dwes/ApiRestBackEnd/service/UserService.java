package com.dwes.ApiRestBackEnd.service;

import com.dwes.ApiRestBackEnd.dto.RankingRequestDTO;
import com.dwes.ApiRestBackEnd.dto.UserRequestDTO;
import com.dwes.ApiRestBackEnd.model.User;
import com.dwes.ApiRestBackEnd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserRequestDTO mapToRequestDto(User user){
        return UserRequestDTO.builder()
                .username(user.getUsername())
                .user_email(user.getUserEmail())
                .score(user.getScore())
                .build();
    }

    ArrayList<User> usersRanking = new ArrayList<>();
    public RankingRequestDTO mapToRankingRequestDto(User user){
        return RankingRequestDTO.builder()
                .username(user.getUsername())
                .score(user.getScore())
                .build();
    }

    @Transactional(readOnly = true)
    public List<UserRequestDTO> showAllUsersDTO(){
        List<User> users = (List<User>) userRepository.findAll();
        return users.stream().map(this::mapToRequestDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<User> showAllUsers(){
        return userRepository.findAll();
    }

    @Transactional
    public User createUser(User user){
        return userRepository.save(user);
    }

    @Transactional
    public String deleteUser(Long id){
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()){
            userRepository.deleteById(id);
            return "Se ha eliminado el usuario correctamente";
        }else throw new IllegalArgumentException("No se ha encontrado el usuario");
    }

    @Transactional
    public void deleteUserByUsername(String username){
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado: " + username));
        
        userRepository.delete(user);
    }

    @Transactional(readOnly = true)
    public List<RankingRequestDTO> getRanking(){
        List<User> users=(List<User>)userRepository.usersRanking();

        return users.stream().map(this::mapToRankingRequestDto).collect(Collectors.toList());

    }

    @Transactional(readOnly = true)
    public List<RankingRequestDTO> getRankingTop3(){
        List<User> users=(List<User>)userRepository.usersRankingTop3();

        return users.stream().map(this::mapToRankingRequestDto).collect(Collectors.toList());

    }

}
