package com.doguskar.todo.repository;

import com.doguskar.todo.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByUsername(@Param("username") String username);
    List<User> findAll();
    void deleteById(Long id);
    Optional<User> findById(Long id);

}
