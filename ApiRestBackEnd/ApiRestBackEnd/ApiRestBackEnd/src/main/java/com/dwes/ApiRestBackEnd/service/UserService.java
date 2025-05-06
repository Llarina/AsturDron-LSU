package com.dwes.ApiRestBackEnd.service;

import com.dwes.ApiRestBackEnd.dto.RankingRequestDTO;
import com.dwes.ApiRestBackEnd.dto.UserRequestDTO;
import com.dwes.ApiRestBackEnd.model.User;
import com.dwes.ApiRestBackEnd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .user_email(user.getUser_email())
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
    public List<UserRequestDTO> showAllUsers(){
        List<User> users = (List<User>) userRepository.findAll();
        return users.stream().map(this::mapToRequestDto).collect(Collectors.toList());
    }

    @Transactional
    public User createUser(User user){
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(User user, Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User userDB = optionalUser.get();
            if ((Objects.nonNull(user.getUsername()) && !"".equalsIgnoreCase(user.getUsername()))) {
                userDB.setUsername(user.getUsername());
            }
            if ((Objects.nonNull(user.getPassword()) && !"".equalsIgnoreCase(user.getPassword()))) {
                userDB.setPassword(user.getPassword());
            }
            if ((Objects.nonNull(user.getType()) && !"".equalsIgnoreCase(user.getType()))) {
                userDB.setType(user.getType());
            }
            if ((Objects.nonNull(user.getUser_email()) && !"".equalsIgnoreCase(user.getUser_email()))) {
                userDB.setUser_email(user.getUser_email());
            }
            if ((Objects.nonNull(user.getScore()))) {
                userDB.setScore(user.getScore());
            }
            return createUser(userDB);
        } else {
            throw new IllegalArgumentException("No se ha encontrado el usuario");
        }
    }

    @Transactional
    public String deleteUser(Long id){
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()){
            userRepository.deleteById(id);
            return "Se ha eliminado el usuario correctamente";
        }else throw new IllegalArgumentException("No se ha encontrado el usuario");
    }

    @Transactional(readOnly = true)
    public List<RankingRequestDTO> getRanking(){
        List<User> users=(List<User>)userRepository.usersRanking();

        return users.stream().map(this::mapToRankingRequestDto).collect(Collectors.toList());

    }

}
