/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package es.esy.elderxavier.repository;

import es.esy.elderxavier.entity.Categorias;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import org.springframework.context.annotation.Bean;

/**
 *
 * @author elder
 */
public class CategoriasDao {
    protected EntityManager entityManager;
    public static CategoriasDao instance;
    
    public static CategoriasDao getInstance() {
        if (instance == null) {
            instance = new CategoriasDao();
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
    
    @SuppressWarnings("unchecked")    
    public List<Categorias> findAllCategory() {
        return entityManager.createQuery(Categorias.class + "FROM ").getResultList();
    }
}
