/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.repository;

import com.pht.pojo.Staff;
import java.util.List;

/**
 *
 * @author ASUS
 */
public interface StaffRepository {
    List<Staff> getStaffs(String kw);
    boolean addOrUpdateStaff(Staff s);
    Staff getStaffById(int staffId);
    boolean deleteStaff(int staffId);
}
