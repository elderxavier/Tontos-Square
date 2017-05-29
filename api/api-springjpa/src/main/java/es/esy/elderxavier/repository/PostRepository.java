/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package es.esy.elderxavier.repository;

import es.esy.elderxavier.entity.Post;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author elder
 */
public interface PostRepository extends JpaRepository<Post, Long> {

    Post findById(int id);

    List<Post> findByIdusuarios(int id_usuario);    

}
