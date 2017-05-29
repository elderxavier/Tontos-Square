
package es.esy.elderxavier.controller;

import es.esy.elderxavier.entity.Categorias;
import es.esy.elderxavier.repository.CategoriasDao;
import es.esy.elderxavier.repository.CategoriasRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;



@Controller
@RequestMapping("/categorias")
public class CategoriaController {
    
    private CategoriasRepository repository;
    private CategoriasDao dao;

    @Autowired
    public CategoriaController(CategoriasRepository repository) {
        this.repository = repository;
        this.dao = CategoriasDao.getInstance();
    } 
    
    
    @CrossOrigin
    @RequestMapping(value = "/parent/{parent}/{token}/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<String> getParent(@PathVariable("parent") int parent, @PathVariable("token") String token) {        
        String response = "";
        if(!token.equals("AE3998A5B3F84DD16E872ED37BCFE")){
            response += "{";
            response += "\"StatusReponse\": 0,";
            response += "\"Message\": \" Token inválido\"";
            response += "}";
            return ResponseEntity.ok().body(response);
        }
        try {
            response += "{";
            response += "\"StatusReponse\": 1,";
            response += "\"Categorias\": [";
            int cont = 1;
            List<Categorias> mylist = repository.findByParent(parent);
            for (Categorias myentity : mylist) {
                cont++;
                response += "{";
                response += "\"id_categoria\":" + myentity.getId() + ",";
                response += "\"nome\":\" " + myentity.getNome() + "\",";
                response += "\"parent\":" + myentity.getParent() + "";                
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
    @RequestMapping(value = "/allcategorias/{token}/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<String> getAll(@PathVariable("token") String token) {        
        String response = "";
        if(!token.equals("AE3998A5B3F84DD16E872ED37BCFE")){
            response += "{";
            response += "\"StatusReponse\": 0,";
            response += "\"Message\": \" Token inválido\"";
            response += "}";
            return ResponseEntity.ok().body(response);
        } 
        
        try {
            response += "{";
            response += "\"StatusReponse\": 1,";
            response += "\"Categorias\": [";
            int cont = 1;
            List<Categorias> mylist = repository.findAll();
            for (Categorias myentity : mylist) {
                cont++;
                response += "{";
                response += "\"id_categoria\":" + myentity.getId() + ",";
                response += "\"nome\":\" " + myentity.getNome() + "\",";
                response += "\"parent\":" + myentity.getParent() + "";                
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
    
    
    
}
