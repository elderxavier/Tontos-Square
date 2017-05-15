package es.esy.elderxavier.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import es.esy.elderxavier.entity.Usuarios;
import es.esy.elderxavier.repository.UsuariosDao;

import es.esy.elderxavier.repository.UsuariosRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@Controller
@RequestMapping("/usuarios")
public class UsuariosController {

    private UsuariosRepository usuariosRepository;
    private UsuariosDao dao;

    @Autowired
    public UsuariosController(UsuariosRepository usuariosRepository) {
        this.usuariosRepository = usuariosRepository;
        this.dao = UsuariosDao.getInstance();
    }
    
    @RequestMapping(value = "/add/{nome}/{email}/{senha}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<String> addUsuario(@PathVariable("nome") String nome, @PathVariable("email") String email, @PathVariable("senha") String senha, Usuarios usuarios) {
        String response = "";
        try{
        response = "{\"StatusReponse\": {\"success\":\"1\"}}";
        usuarios.setNome(nome);
        usuarios.setEmail(email);
        usuarios.setSenha(senha);
        dao.InsertUsuario(usuarios);
        response += "{\"return\": {\"nome\":\"" + nome + "\"}, {\"email\":\"" + email + "\"}, {\"senha\":\"" + senha + "\"}}";        
        return ResponseEntity.ok().body(response);
        }catch(Exception ex){
            response = "{\"StatusReponse\": {\"success\":\"0\"}}";
            response += "{\"Message\": {\"message\":\""+ex.getMessage()+"\"}}";
            return ResponseEntity.ok().body(response);            
        }
    }

    @RequestMapping(value = "/teste", method = RequestMethod.GET)
    public String listaLivros() {
        
        //return "listaLivros";
        return "teste";
    }

    @RequestMapping(value = "/api/{nome}/{email}", method = RequestMethod.GET)
    public ResponseEntity<String> testando(@PathVariable("nome") String nome, @PathVariable("email") String email) {
        String response = "{\"StatusReponse\": {\"success\":\"elder\"}}";
        //response += "{\"return\": {\"nome\":\""+nome+"\"}}";
        response += "{\"return\": {\"nome\":\"" + nome + "\"}, {\"email\":\"" + email + "\"}}";
        //String response = "{ \"name\":\"John\", \"age\":30, \"cars\":[ \"Ford\", \"BMW\", \"Fiat\" ] }";
        return ResponseEntity.ok().body(response);
    }

    @RequestMapping(value = "/listar", method = RequestMethod.GET)
    public ResponseEntity<String> listar() {
        String response = "{\"StatusReponse\": {\"success\":\"elder\"}}";
        
        
        for (Usuarios usuarios : dao.findAll()) {
            response+= "Nome: " + usuarios.getNome();
        }
        
        //String response = "{ \"name\":\"John\", \"age\":30, \"cars\":[ \"Ford\", \"BMW\", \"Fiat\" ] }";
        return ResponseEntity.ok().body(response);
    }
}
