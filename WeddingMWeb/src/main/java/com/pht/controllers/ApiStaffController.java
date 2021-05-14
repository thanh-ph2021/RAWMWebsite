/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.controllers;

import com.pht.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ASUS
 */
@RestController
@RequestMapping("/api")
public class ApiStaffController {
    @Autowired
    private StaffService staffService;
    
    @DeleteMapping("/staffs/{staffId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteProduct(@PathVariable(name = "staffId") int staffId) {
        this.staffService.deleteStaff(staffId);
    }
}
