/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.repository.impl;

import com.pht.pojo.Hall;
import com.pht.repository.HallRepository;
import java.util.List;
import javax.persistence.Query;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;

/**
 *
 * @author ASUS
 */
@Repository
public class HallRepositoryImpl implements HallRepository{

    @Autowired
    private LocalSessionFactoryBean sessionFactory;
    
    @Override
    @Transactional
    public List<Hall> getHalls() {
        Session session = this.sessionFactory.getObject().getCurrentSession();

        Query q = session.createQuery("From Hall");
        return q.getResultList();
    }
    
}
