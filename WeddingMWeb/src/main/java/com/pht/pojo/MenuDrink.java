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
@Table(name = "menu_drink")
public class MenuDrink implements Serializable{
    @Id
    @ManyToOne
    @JoinColumn(name = "id_menu")
    private Menu menu;
    @Id
    @ManyToOne
    @JoinColumn(name = "id_drink")
    private Drink drink;

    public Menu getMenu() {
        return menu;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }

    public Drink getDrink() {
        return drink;
    }

    public void setDrink(Drink drink) {
        this.drink = drink;
    }
    
    
}
