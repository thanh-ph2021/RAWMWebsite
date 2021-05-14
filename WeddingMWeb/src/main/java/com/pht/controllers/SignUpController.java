/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.controllers;

import com.pht.pojo.Staff;
import com.pht.pojo.User;
import com.pht.service.UserService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *
 * @author ASUS
 */
@Controller
public class SignUpController {
    @Autowired
    private UserService userService;
    @RequestMapping("/sign-up")
    public String signUpView(Model model) {
        model.addAttribute("user", new User());
        return "sign-up";
    }
    
    @PostMapping("/sign-up")
    public String addUser(Model model, @ModelAttribute(value = "user") @Valid User u,
            BindingResult result) {
        if(u.getPass().equals(u.getConfirmPassword())){
            u.setPass(BCrypt.hashpw(u.getPass().trim(), BCrypt.gensalt(10)));
            u.setConfirmPassword(BCrypt.hashpw(u.getPass().trim(), BCrypt.gensalt(10)));
            if(userService.addUser(u)){
                return "redirect:/login";
            } else {
                model.addAttribute("errorMsg", "Username already exists!!");
                return "sign-up";
            }
        } else {
            model.addAttribute("errorMsg", "Confirm Password Is Wrong!!");
            return "sign-up";
        }
    }
}
