/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 *
 * @author ASUS
 */
@Controller
public class SignUpController {
    @GetMapping("/sign-up")
    public String signUp(Model model) {
        return "sign-up";
    } 
}
