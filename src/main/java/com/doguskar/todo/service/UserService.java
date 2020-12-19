package com.doguskar.todo.service;

import com.doguskar.todo.dto.AdminInsertUserResponseDto;
import com.doguskar.todo.dto.AdminUpdateUserResponseDto;
import com.doguskar.todo.dto.SignUpResponseDto;
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
    public Optional<User> findByUsername(String username){
        return repository.findByUsername(username);
    }
    public AdminInsertUserResponseDto insertUser(UserDto dto){
        /*Validations*/
        SignUpResponseDto responseDto = new SignUpResponseDto();
        String username = dto.getUsername();
        String password = dto.getPassword();
        if (username == null || username.length() < 3){
            responseDto.setNotUsernameValid(true);
            return new AdminInsertUserResponseDto(
                    responseDto,
                    null
            );
        }
        if (password == null || password.length() < 6){
            responseDto.setNotPasswordValid(true);
            return new AdminInsertUserResponseDto(
                    responseDto,
                    null
            );
        }
        Optional<User> user = repository.findByUsername(username);
        if(user.isPresent()){
            responseDto.setUsernameUsed(true);
            return new AdminInsertUserResponseDto(
                    responseDto,
                    null
            );
        }
        /*Save User*/
        AppUserRole role;
        switch (dto.getRole()){
            case "USER": role = AppUserRole.USER; break;
            case "ADMIN": role = AppUserRole.ADMIN; break;
            default: role = AppUserRole.USER;
        }
        User registeredUser = repository.save(new User(
                dto.getUsername(),
                passwordEncoder.encode(dto.getPassword()),
                role,
                true,true,true,true
        ));
        if (registeredUser != null){
            responseDto.setResult(true);
            return new AdminInsertUserResponseDto(
                    responseDto,
                    new UserDto(
                            registeredUser.getId(),
                            registeredUser.getUsername(),
                            registeredUser.getPassword(),
                            registeredUser.getAppUserRole().name()
                    )
            );
        }
        return new AdminInsertUserResponseDto(
                responseDto,
                null
        );
    }
    public SignUpResponseDto register(UserDto dto){
        /*Validations*/
        SignUpResponseDto responseDto = new SignUpResponseDto();
        String username = dto.getUsername();
        String password = dto.getPassword();
        if (username == null || username.length() < 3){
            responseDto.setNotUsernameValid(true);
            return responseDto;
        }
        if (password == null || password.length() < 6){
            responseDto.setNotPasswordValid(true);
            return responseDto;
        }
        Optional<User> user = repository.findByUsername(username);
        if(user.isPresent()){
            responseDto.setUsernameUsed(true);
            return responseDto;
        }
        /*Save User*/
        User registeredUser = repository.save(new User(
                dto.getUsername(),
                passwordEncoder.encode(dto.getPassword()),
                AppUserRole.USER,
                true,true,true,true
        ));
        if (registeredUser != null){
            responseDto.setResult(true);
            return responseDto;
        }
        return responseDto;
    }
    public AdminUpdateUserResponseDto updateAll(UserDto dto){
        AdminUpdateUserResponseDto responseDto = new AdminUpdateUserResponseDto();
        if (dto.getId() == null){
            return responseDto;
        }
        Optional<User> userOpt = repository.findById(dto.getId());
        if (!userOpt.isPresent()){
            responseDto.setNotUserIdValid(true);
            return responseDto;
        }
        User user = userOpt.get();
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()){
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        Optional<User> usernameContol = repository.findByUsername(dto.getUsername());
        if(usernameContol.isPresent() && user.getId() != usernameContol.get().getId()){
            responseDto.setUsernameUsed(true);
            return responseDto;
        }
        user.setUsername(dto.getUsername());
        AppUserRole role;
        switch (dto.getRole()){
            case "USER": role = AppUserRole.USER; break;
            case "ADMIN": role = AppUserRole.ADMIN; break;
            default: role = AppUserRole.USER;
        }
        user.setAppUserRole(role);
        User updatedUser = repository.save(user);
        UserDto userDto = new UserDto(
                updatedUser.getId(),
                updatedUser.getUsername(),
                updatedUser.getPassword(),
                updatedUser.getAppUserRole().name()
        );
        responseDto.setUser(userDto);
        responseDto.setResult(true);
        return responseDto;
    }

    public void delete(Long id){
        repository.deleteById(id);
    }

}
