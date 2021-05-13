/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.service.impl;

import com.pht.pojo.Hall;
import com.pht.repository.HallRepository;
import com.pht.service.HallService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ASUS
 */
@Service
public class HallServiceImpl implements HallService{
    @Autowired
    private HallRepository hallRepository;

    @Override
    public List<Hall> getHalls() {
        return hallRepository.getHalls();
    }
}
