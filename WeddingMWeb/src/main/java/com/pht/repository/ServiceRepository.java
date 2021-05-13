/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.repository;

import com.pht.pojo.Hall;
import com.pht.pojo.Service;
import java.util.List;

/**
 *
 * @author ASUS
 */
public interface ServiceRepository {
    List<Service> getServices();
}
