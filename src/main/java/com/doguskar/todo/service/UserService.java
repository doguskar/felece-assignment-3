package com.doguskar.todo.service;

import com.doguskar.todo.dto.UserDto;
import com.doguskar.todo.auth.AppUserRole;
import com.doguskar.todo.entity.User;
import com.doguskar.todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    UserRepository repository;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        Optional<User> user = repository.findByUsername(s);
        return user.orElseThrow(() -> new UsernameNotFoundException("User cannot found!"));
    }

    public List<UserDto> findAll(){
        List<User> ls = repository.findAll();
        List<UserDto> users = new ArrayList<>();
        for(User i : ls){
            users.add(new UserDto(
                    i.getId(),
                    i.getUsername(),
                    i.getPassword(),
                    i.getAppUserRole().name()
            ));
        }
        return users;
    }
    public UserDto findById(Long id){
        User user = repository.findById(id).get();
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                user.getAppUserRole().name()
        );
    }
    public UserDto save(UserDto dto){
        if (dto.getUsername() == null && dto.getPassword() == null){
            return null;
        }
        Optional<User> usernameControl = repository.findByUsername(dto.getUsername());
        if (usernameControl.isPresent()){
            return null;
        }
        AppUserRole role = AppUserRole.USER;
        if (dto.getRole() != null && dto.getRole().equals("ADMIN"))
            role = AppUserRole.ADMIN;
        User user = new User(
                dto.getUsername(),
                passwordEncoder.encode(dto.getPassword()),
                role,
                true,true,true,true
        );
        User createdUser = repository.save(user);
        return new UserDto(
                createdUser.getId(),
                createdUser.getUsername(),
                createdUser.getPassword(),
                createdUser.getAppUserRole().name()
        );
    }
    public UserDto update(UserDto dto){
        if (dto.getId() == null){
            return null;
        }
        User user = repository.findById(dto.getId()).get();
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()){
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        AppUserRole role = AppUserRole.USER;
        if (dto.getRole() != null && dto.getRole().equals("ADMIN"))
            role = AppUserRole.ADMIN;
        user.setAppUserRole(role);
        User updatedUser = repository.save(user);
        return new UserDto(
                updatedUser.getId(),
                updatedUser.getUsername(),
                updatedUser.getPassword(),
                updatedUser.getAppUserRole().name()
        );
    }

    public void delete(Long id){
        repository.deleteById(id);
    }

}
