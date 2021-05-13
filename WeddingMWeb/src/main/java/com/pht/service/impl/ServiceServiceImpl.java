/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.service.impl;

import com.pht.repository.HallRepository;
import com.pht.repository.ServiceRepository;
import com.pht.service.ServiceService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
/**
 *
 * @author ASUS
 */
@Service
public class ServiceServiceImpl implements ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Override
    public List<com.pht.pojo.Service> getServices() {
        return this.serviceRepository.getServices();
    }

}
