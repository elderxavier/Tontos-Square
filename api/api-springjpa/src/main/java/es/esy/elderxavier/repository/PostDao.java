/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package es.esy.elderxavier.repository;

import es.esy.elderxavier.entity.Post;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import org.springframework.context.annotation.Bean;

/**
 *
 * @author elder
 */
public class PostDao {
    
    protected EntityManager entityManager;
    public static PostDao instance;
    
    public static PostDao getInstance() {
        if (instance == null) {
            instance = new PostDao();
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

    public PostDao() {
        entityManager = getEntityManager();
    }
    
    public List<Post> findAll(int id_usuarios) {
        //return entityManager.createQuery("FROM p from post_usarios p where p.id_usuarios = : id_usuarios").setParameter("id_usuarios", id_usuarios).getResultList();
        return entityManager.createQuery("FROM " + Post.class.getName()).getResultList();
    }
    
    
    public Post InsertPost(Post post) {        
        try {
            entityManager.getTransaction().begin();
            entityManager.persist(post);
            entityManager.getTransaction().commit();
            return post;
        } catch (Exception ex) {
            ex.printStackTrace();            
            entityManager.getTransaction().rollback();            
        }
        return post;
    }
}
