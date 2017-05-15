package es.esy.elderxavier.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.sql.Timestamp;
import javax.persistence.Table;

@Entity(name = "usuarios")
@Table(name = "usuarios")
public class Usuarios {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    
    @Column(name="nome", nullable=false)
    private String nome;
    
    @Column(name="email", nullable=false)
    private String email;
    
    @Column(name="senha", nullable=false)
    private String senha;
    
    
    @Column(name = "created", nullable = true)
    private Timestamp created;

    @Column(name = "updated", nullable = true)
    private Timestamp updated;
    
    
    

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
    
     public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
    
    public Timestamp getCreated() {
        return created;
    }

    public void setCreated(Timestamp created) {
        this.created = created;
    }

    public Timestamp getUpdated() {
        return updated;
    }

    public void setUpdated(Timestamp updated) {
        this.updated = updated;
    }
    
    
   

    public String teste() {
        String t = "testado!!!";
        return t;
    }

}
