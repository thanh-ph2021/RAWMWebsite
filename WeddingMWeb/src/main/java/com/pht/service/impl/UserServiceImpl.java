/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.service.impl;

import com.pht.pojo.User;
import com.pht.repository.UserRepository;
import com.pht.service.UserService;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author ASUS
 */
@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    @Transactional
    public void addUser(User user) {
        user.setPass(
                bCryptPasswordEncoder.encode(user.getPass()));
        userRepository.addUser(user);
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        return userRepository.getUsers(username).get(0);
    }


}
