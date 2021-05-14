/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.service.impl;

import com.pht.pojo.Position;
import com.pht.repository.PositionRepository;

import com.pht.service.PositionService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ASUS
 */
@Service
public class PositionServiceImpl implements PositionService{
    @Autowired
    private PositionRepository positionRepository;
    
    @Override
    public List<Position> getPositions() {
        return this.positionRepository.getPositions();
    }
    
}
