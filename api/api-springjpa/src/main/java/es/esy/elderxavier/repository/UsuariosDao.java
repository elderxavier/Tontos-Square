/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package es.esy.elderxavier.repository;

import es.esy.elderxavier.entity.Usuarios;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import org.springframework.context.annotation.Bean;

/**
 *
 * @author elder
 */
public class UsuariosDao {
    protected EntityManager entityManager;
    public static UsuariosDao instance;
    
    public static UsuariosDao getInstance() {
        if (instance == null) {
            instance = new UsuariosDao();
        }
        return instance;
    }
    
    @Bean
    public EntityManager getEntityManager() {
        EntityManagerFactory factory = Persistence.createEntityManagerFactory("usuariosDB");
        if (entityManager == null) {
            entityManager = factory.createEntityManager();
        }

        return entityManager;
    }

    public UsuariosDao() {
        entityManager = getEntityManager();
    }
    
    @SuppressWarnings("unchecked")    
    public List<Usuarios> findAll() {
        return entityManager.createQuery("FROM " + Usuarios.class.getName()).getResultList();
    }
    
    public Usuarios InsertUsuario(Usuarios usuario) {        
        try {
            entityManager.getTransaction().begin();
            entityManager.persist(usuario);
            entityManager.getTransaction().commit();
            return usuario;
        } catch (Exception ex) {
            ex.printStackTrace();            
            entityManager.getTransaction().rollback();            
        }
        return usuario;
    }
    
    public boolean UpdateUser(Usuarios usuario) {
        try {
            entityManager.getTransaction().begin();
            entityManager.merge(usuario);
            entityManager.getTransaction().commit();
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            entityManager.getTransaction().rollback();
            return false;
        }
    }
    
    public boolean DeleteUsuario(int id) {
        try {
            entityManager.getTransaction().begin();
            Usuarios usuario = entityManager.find(Usuarios.class, id);
            entityManager.remove(usuario);
            entityManager.getTransaction().commit();
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            entityManager.getTransaction().rollback();
            return false;
        }
    }    
}
