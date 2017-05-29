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
import org.springframework.web.bind.annotation.CrossOrigin;
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
    @CrossOrigin
    @RequestMapping(value = "/addlocation/{idusuarios}/{idcategoria}/{titulo}/{latitude}/{longitude}/{token}/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<String> addPost(@PathVariable("idusuarios") int idusuarios, @PathVariable("idcategoria") int idcategoria, @PathVariable("titulo") String titulo, @PathVariable("latitude") double latitude, @PathVariable("longitude") double longitude, @PathVariable("token") String token, Post entity) {
        String response = "";
        if (!token.equals("AE3998A5B3F84DD16E872ED37BCFE")) {
            response += "{";
            response += "\"StatusReponse\": 0,";
            response += "\"Message\": \" Token inválido\"";
            response += "}";
            return ResponseEntity.ok().body(response);
        }
        try {
            entity.setId_usuarios(idusuarios);
            entity.setId_categoria(idcategoria);
            entity.setTitulo(titulo);
            entity.setLongitude(longitude);
            entity.setLatitude(latitude);
            dao.InsertPost(entity);
            
            response += "{";
            response += "\"StatusReponse\":1,";
            response += "\"Message\": \"Checkin realizado com sucesso! \"";
            response += "}";
            return ResponseEntity.ok().body(response);
        } catch (Exception ex) {
            response += "{";
            response += "\"StatusReponse\": 0,";
            response += "\"Message\": \"" + ex.getMessage() + "\"";
            response += "}";
            return ResponseEntity.ok().body(response);
        }
    }
    @CrossOrigin
    @RequestMapping(value = "/mylocations/{latitude}/{longitude}/{token}/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<String> myPost(@PathVariable("latitude") double latitude, @PathVariable("longitude") double longitude, @PathVariable("token") String token, Post entity) {
        String response = "";
        if (!token.equals("AE3998A5B3F84DD16E872ED37BCFE")) {
            response += "{";
            response += "\"StatusReponse\": 0,";
            response += "\"Message\": \" Token inválido\"";
            response += "}";
            return ResponseEntity.ok().body(response);
        }
        try {
            response += "{";
            response += "\"StatusReponse\": 1,";
            response += "\"Post\": [";
            int cont = 1;
            List<Post> mylist = dao.getMylocations(latitude, longitude);
            for( Post myentity :  mylist){
                cont++;
                response += "{";
                response += "\"id_post_usarios\":" + myentity.getId_post_usarios() + ",";
                
                response += "\"id_usuarios\":" + myentity.getId_usuarios()+ ",";
                
                response += "\"titulo\":\"" + myentity.getTitulo() + "\",";                
                response += "\"id_categoria\":" + myentity.getId_categoria() + ",";                
                
                response += "\"latitude\":" + myentity.getLatitude() + ",";                
                response += "\"longitude\":" + myentity.getLongitude() + ",";                
                response += "\"comentario\":\"" + myentity.getComentario() + "\",";                
                response += "\"avaliacao\":" + myentity.getAvaliacao() + "";                
                response += "}";                
                response+= cont <= mylist.size() ? "," : "";                
            }
            
            response += "]";
            response += "}";
            return ResponseEntity.ok().body(response);
        } catch (Exception ex) {
            response += "{";
            response += "\"StatusReponse\": 0,";
            response += "\"Message\": \"" + ex.getMessage() + "\"";
            response += "}";
            return ResponseEntity.ok().body(response);
        }
    }
    
    @CrossOrigin
    @RequestMapping(value = "/{idusuarios}/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<String> getPostUsuario(@PathVariable("idusuarios") int idusuarios, Post entity) {
        String response = "";
        try {
            response = "{\"StatusReponse\": {\"success\":\"1\"}}";

            response += "{\"Post\": [";
            int cont = 1;
            List<Post> mylist = repository.findByIdusuarios(idusuarios);
            for (Post post : mylist) {
                cont++;
                response += "{";
                response += "\"id_post_usarios\":" + post.getId_post_usarios() + ",";
                response += "\"id_usuarios\":" + post.getId_usuarios() + ",";
                response += "\"id_categoria\":" + post.getId_categoria() + ",";
                response += "\"latitude\":" + post.getLatitude() + ",";
                response += "\"longitude\":" + post.getLongitude() + ",";
                response += "\"titulo\":\"" + post.getTitulo() + "\",";
                response += "\"comentario\":\"" + post.getComentario() + "\",";
                response += "\"avaliacao\":" + post.getAvaliacao();
                response += "}";
                response += cont <= mylist.size() ? "," : "";
            }
            response += "]}";

            return ResponseEntity.ok().body(response);
        } catch (Exception ex) {
            response += "{";
            response += "\"StatusReponse\": 0,";
            response += "\"Message\": \"" + ex.getMessage() + "\"";
            response += "}";
            return ResponseEntity.ok().body(response);
        }
    }
}
