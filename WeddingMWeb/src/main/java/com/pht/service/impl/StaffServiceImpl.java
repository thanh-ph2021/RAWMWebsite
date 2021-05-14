/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.service.impl;

import com.pht.pojo.Staff;
import com.pht.repository.StaffRepository;
import com.pht.service.StaffService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ASUS
 */
@Service
public class StaffServiceImpl implements StaffService {

    @Autowired
    private StaffRepository staffRepository;

    @Override
    public List<Staff> getStaffs(String kw) {
        return this.staffRepository.getStaffs(kw);
    }

    @Override
    public boolean addOrUpdateStaff(Staff s) {
        return this.staffRepository.addOrUpdateStaff(s);
    }

    @Override
    public Staff getStaffById(int i) {
        return this.staffRepository.getStaffById(i);
    }

    @Override
    public boolean deleteStaff(int i) {
        return this.staffRepository.deleteStaff(i);
    }

}
