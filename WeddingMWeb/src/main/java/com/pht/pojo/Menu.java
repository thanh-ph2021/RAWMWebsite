/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.pojo;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 *
 * @author ASUS
 */
@Entity
@Table(name = "menu")
public class Menu implements Serializable{
    @Id
    private int id;
    private int name; 

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getName() {
        return name;
    }

    public void setName(int name) {
        this.name = name;
    }
    
}
