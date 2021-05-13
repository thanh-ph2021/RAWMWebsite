/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.pojo;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;

/**
 *
 * @author ASUS
 */
@Entity
@Table(name = "party_book_information")
public class PartyBookInformation implements Serializable{
    @Id
    private int id;
    @JoinColumn(name = "groom_name")
    private String groomName;
    @JoinColumn(name = "bride_name")
    private String brideName;
    @JoinColumn(name = "organization_date")
    @Temporal(javax.persistence.TemporalType.DATE)
    private Date organizationDate;
    private BigDecimal deposit;
    private String timeOrg;
    @JoinColumn(name = "number_table")
    private int numberTable;
    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;
    @ManyToOne
    @JoinColumn(name = "id_service")
    private Service service;
    @ManyToOne
    @JoinColumn(name = "id_menu")
    private Menu menu;
    @ManyToOne
    @JoinColumn(name = "id_hall")
    private Hall hall;
    @ManyToOne
    @JoinColumn(name = "id_banquet_type")
    
    private BanquetType banquetType;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getGroomName() {
        return groomName;
    }

    public void setGroomName(String groomName) {
        this.groomName = groomName;
    }

    public String getBrideName() {
        return brideName;
    }

    public void setBrideName(String brideName) {
        this.brideName = brideName;
    }

    public Date getOrganizationDate() {
        return organizationDate;
    }

    public void setOrganizationDate(Date organizationDate) {
        this.organizationDate = organizationDate;
    }

    public BigDecimal getDeposit() {
        return deposit;
    }

    public void setDeposit(BigDecimal deposit) {
        this.deposit = deposit;
    }

    public String getTime() {
        return timeOrg;
    }

    public void setTime(String timeOrg) {
        this.timeOrg = timeOrg;
    }

    public int getNumberTable() {
        return numberTable;
    }

    public void setNumberTable(int numberTable) {
        this.numberTable = numberTable;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Service getService() {
        return service;
    }

    public void setService(Service service) {
        this.service = service;
    }

    public Menu getMenu() {
        return menu;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }

    public Hall getHall() {
        return hall;
    }

    public void setHall(Hall hall) {
        this.hall = hall;
    }

    public BanquetType getBanquetType() {
        return banquetType;
    }

    public void setBanquetType(BanquetType banquetType) {
        this.banquetType = banquetType;
    }
    
    
}
