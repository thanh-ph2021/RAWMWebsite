/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.controllers;

import com.pht.pojo.Staff;
import com.pht.service.PositionService;
import com.pht.service.StaffService;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 *
 * @author ASUS
 */
@Controller
@RequestMapping("/admin/staff")
public class StaffController {

    @Autowired
    private StaffService staffService;
    @Autowired
    private PositionService positionService;

    @ModelAttribute
    public void addAttributes(Model model) {
        model.addAttribute("staff", this.staffService.getStaffs(""));
        model.addAttribute("positions", this.positionService.getPositions());

    }

    @RequestMapping("")
    public String showStaff(Model model) {
        model.addAttribute("staffs", new Staff());
        return "staff";
    }
    
    @PostMapping("")
    public String searchStaff(Model model, @ModelAttribute(value = "staffs") @Valid Staff s,
            BindingResult result) {
        model.addAttribute("staff", this.staffService.getStaffs(s.getName()));
        return "staff";
    }

    @GetMapping("/add")
    public String addView(Model model,
             @RequestParam(name = "staffId",
                    required = false,
                    defaultValue = "0") int staffId) {
        if (staffId > 0) {
            model.addAttribute("staffs", this.staffService.getStaffById(staffId));
        } else {
            model.addAttribute("staffs", new Staff());
        }

        return "addOrEdit";
    }

    @PostMapping("/add")
    public String addStaff(Model model,
            @ModelAttribute(value = "staffs") @Valid Staff s,
            BindingResult result) {
        if (result.hasErrors()) {
            return "addOrEdit";
        }

        if (!this.staffService.addOrUpdateStaff(s)) {
            model.addAttribute("erroMsg", "Something Wrong!!!");
            return "addOrEdit";
        }

        return "redirect:/admin/staff";
    }
}
