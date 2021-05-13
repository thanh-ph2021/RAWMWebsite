/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.service;

import com.pht.pojo.User;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 *
 * @author ASUS
 */
public interface UserService  {
    void addUser(User user);
    User getUserByUsername(String username);
}
