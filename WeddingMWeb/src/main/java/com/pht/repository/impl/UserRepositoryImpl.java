/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.repository.impl;

import com.pht.pojo.User;
import com.pht.repository.UserRepository;
import java.util.List;
import javax.persistence.Query;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author ASUS
 */
@Repository
public class UserRepositoryImpl implements UserRepository{
    @Autowired
    private LocalSessionFactoryBean sessionFactory;

    @Override
    public void addUser(User user) {
       sessionFactory.getObject().getCurrentSession().save(user);
    }

    @Override
    public List<User> getUsers(String username) {
        Session session = this.sessionFactory.getObject().getCurrentSession();
        Query q = session.createQuery("FROM User WHERE userName = '" + username + "'");
        return q.getResultList();
    }

    
}
