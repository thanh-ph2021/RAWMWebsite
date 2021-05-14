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
public class UserRepositoryImpl implements UserRepository {

    @Autowired
    private LocalSessionFactoryBean sessionFactory;

    @Override
    @Transactional
    public boolean addUser(User user) {
        Session session = sessionFactory.getObject().getCurrentSession();
        if (getUserByUsername(user.getUserName()) == null) {
            List<User> list = getUsers();
            int i = list.get(list.size() - 1).getId() + 1;
            user.setId(i);
            user.setRole("ROLE_USER");
            session.save(user);
            return true;
        } else {
            return false;
        }
    }

    @Override
    @Transactional
    public User getUserByUsername(String username) {
        Session session = this.sessionFactory.getObject().getCurrentSession();
        Query q = session.createQuery("FROM User WHERE userName = '" + username + "'");
        List<User> user = q.getResultList();
        if(user.size() == 0){
            return null;
        }
        return user.get(0);
    }

    @Override
    @Transactional
    public List<User> getUsers() {
        Session session = this.sessionFactory.getObject().getCurrentSession();

        Query q = session.createQuery("From User");
        return q.getResultList();
    }

}
