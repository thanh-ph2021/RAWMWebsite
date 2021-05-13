/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.formatter;

import com.pht.pojo.Position;
import java.text.ParseException;
import java.util.Locale;
import org.springframework.format.Formatter;

/**
 *
 * @author ASUS
 */
public class PositionFormatter implements Formatter<Position>{

    @Override
    public String print(Position t, Locale locale) {
        return String.valueOf(t.getId());
    }

    @Override
    public Position parse(String string, Locale locale) throws ParseException {
       Position p = new Position();
       p.setId(Integer.parseInt(string));
       
       return p;
    }
    
}
