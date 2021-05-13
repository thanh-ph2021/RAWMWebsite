/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.pojo;

import java.io.Serializable;
import java.math.BigDecimal;
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
@Table(name = "bill")
public class Bill implements Serializable{
    @Id
    private int id;
    private BigDecimal deposit;     // tiền cọc
    private BigDecimal forfeit;     // tiền phạt
    @JoinColumn(name = "total_money")
    private BigDecimal totalMoney;
    @ManyToOne
    @JoinColumn(name = "party_book_info")
    private PartyBookInformation partyBookInformation;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public BigDecimal getDeposit() {
        return deposit;
    }

    public void setDeposit(BigDecimal deposit) {
        this.deposit = deposit;
    }

    public BigDecimal getForfeit() {
        return forfeit;
    }

    public void setForfeit(BigDecimal forfeit) {
        this.forfeit = forfeit;
    }

    public BigDecimal getTotalMoney() {
        return totalMoney;
    }

    public void setTotalMoney(BigDecimal totalMoney) {
        this.totalMoney = totalMoney;
    }

    public PartyBookInformation getPartyBookInformation() {
        return partyBookInformation;
    }

    public void setPartyBookInformation(PartyBookInformation partyBookInformation) {
        this.partyBookInformation = partyBookInformation;
    }
    
    
}
