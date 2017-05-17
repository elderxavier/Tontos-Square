/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package es.esy.elderxavier.controller;

import es.esy.elderxavier.entity.Post;
import es.esy.elderxavier.repository.PostDao;
import es.esy.elderxavier.repository.PostRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 * @author elder
 */
@Controller
@RequestMapping("/post")
public class PostController {

    private PostRepository repository;
    private PostDao dao;

    @Autowired
    public PostController(PostRepository repository) {
        this.repository = repository;
        this.dao = PostDao.getInstance();
    }

    @RequestMapping(value = "/teste", method = RequestMethod.GET)
    public String teste() {
        return "teste";
    }

    @RequestMapping(value = "/add/{idusuarios}/{idcategoria}/{comentario}/{longitude}/{latitude}/{avaliacao}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<String> addPost(@PathVariable("idusuarios") int idusuarios, @PathVariable("idcategoria") int idcategoria, @PathVariable("comentario") String comentario, @PathVariable("longitude") float longitude, @PathVariable("latitude") float latitude, @PathVariable("avaliacao") float avaliacao, Post entity) {
        String response = "";
        try {
            response = "{\"StatusReponse\": {\"success\":\"1\"}}";
            entity.setId_usuarios(idusuarios);
            entity.setId_categoria(idcategoria);
            entity.setComentario(comentario);
            entity.setLongitude(longitude);
            entity.setLatitude(latitude);
            entity.setAvaliacao(avaliacao);

            dao.InsertPost(entity);
            return ResponseEntity.ok().body(response);
        } catch (Exception ex) {
            response = "{\"StatusReponse\": {\"success\":\"0\"}}";
            response += "{\"Message\": {\"message\":\"" + ex.getMessage() + "\"}}";
            return ResponseEntity.ok().body(response);
        }
    }

    @RequestMapping(value = "/{idusuarios}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<String> getPostUsuario(@PathVariable("idusuarios") int idusuarios, Post entity) {
        String response = "";
        try {
            response = "{\"StatusReponse\": {\"success\":\"1\"}}";

            response += "{Post: {";
            int cont = 1;
            List<Post> mylist = repository.findByIdusuarios(idusuarios);
            for (Post post : mylist) {
                cont++;
                response += "{";

                response += "\"id_post_usarios\":" + post.getId_post_usarios() + ",";
                response += "\"id_usuarios\":" + post.getId_usuarios() + ",";
                response += "\"id_categoria\":" + post.getId_categoria() + ",";
                response += "\"longitude\":" + post.getLongitude() + ",";
                response += "\"latitude\":" + post.getLatitude() + ",";
                response += "\"comentario\":" + post.getComentario() + ",";
                response += "\"avaliacao\":" + post.getAvaliacao();
                response += "}";
                
                response+= cont <= mylist.size() ? "," : "";
            }

            response += "}";

            return ResponseEntity.ok().body(response);
        } catch (Exception ex) {
            response = "{\"StatusReponse\": {\"success\":\"0\"}}";
            response += "{\"Message\": {\"message\":\"" + ex.getMessage() + "\"}}";
            return ResponseEntity.ok().body(response);
        }
    }
}
