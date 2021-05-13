/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.pojo;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 *
 * @author ASUS
 */
@Entity
@Table(name = "menu_food")
public class MenuFood implements Serializable{
    @Id
    @ManyToOne
    @JoinColumn(name = "id_menu")
    private Menu menu;
    @Id
    @ManyToOne
    @JoinColumn(name = "id_food")
    private Food food;

    public Menu getMenu() {
        return menu;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }

    public Food getFood() {
        return food;
    }

    public void setFood(Food food) {
        this.food = food;
    }
    
    
}
