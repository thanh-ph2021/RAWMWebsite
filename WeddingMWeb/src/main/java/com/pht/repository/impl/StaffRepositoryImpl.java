/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.pht.repository.impl;

import com.pht.pojo.Staff;
import com.pht.repository.StaffRepository;
import java.util.List;
import javax.persistence.Query;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;

/**
 *
 * @author ASUS
 */
@Repository
public class StaffRepositoryImpl implements StaffRepository{

    @Autowired
    private LocalSessionFactoryBean sessionFactory;
    
    @Override
    @Transactional
    public List<Staff> getStaffs(String kw) {
        Session session = this.sessionFactory.getObject().getCurrentSession();

        CriteriaBuilder builder = session.getCriteriaBuilder();
        CriteriaQuery<Staff> query = builder.createQuery(Staff.class);
        Root root = query.from(Staff.class);
        query.select(root);

        if (kw != null && !kw.isEmpty()) {
            Predicate p = builder.like(root.get("name").as(String.class),
                    String.format("%%%s%%", kw));
            query = query.where(p);
        }

        Query q = session.createQuery(query);
        return q.getResultList();
    }

    @Override
    @Transactional
    public boolean addOrUpdateStaff(Staff s) {
        Session session = this.sessionFactory.getObject().getCurrentSession();
        try {
            if (s.getId() > 0) {
                session.update(s);
            } else {
                List<Staff> list = getStaffs("");
                int i = list.get(list.size()-1).getId() + 1;
                s.setId(i);
                session.save(s);
            }

            return true;
        } catch (HibernateException ex) {
            ex.printStackTrace();
        }

        return false;
    }

    @Override
    @Transactional
    public Staff getStaffById(int i) {
        Session session = this.sessionFactory.getObject().getCurrentSession();
        return session.get(Staff.class, i);
    }

    @Override
    @Transactional
    public boolean deleteStaff(int i) {
        try {
            Session session = this.sessionFactory.getObject().getCurrentSession();
            session.delete(session.get(Staff.class, i));

            return true;
        } catch (HibernateException ex) {
            ex.printStackTrace();
        }

        return false;
    }
    
}
