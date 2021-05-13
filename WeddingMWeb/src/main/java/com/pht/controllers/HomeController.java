/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.controllers;

import com.pht.service.HallService;
import com.pht.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *
 * @author ASUS
 */
@Controller
public class HomeController {
    
    @Autowired
    private HallService hallService;
    @Autowired
    private ServiceService serviceService;
    
    @ModelAttribute
    public void addAttributes(Model model) {
        model.addAttribute("halls", this.hallService.getHalls());
        model.addAttribute("services", this.serviceService.getServices());
        
    }
            
    @RequestMapping("/")
    public String index(Model model){
        
        return "index";
    }
    
    @GetMapping("/about")
    public String showAbout(Model model){
        
        return "about";
    }
}
