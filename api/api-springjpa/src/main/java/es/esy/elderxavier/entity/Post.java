/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package es.esy.elderxavier.entity;

import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 *
 * @author elder
 */
@Entity(name = "post_usarios")
@Table(name = "post_usarios")
public class Post {

    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="id_post_usarios", nullable=false)
    private int id;
    
    @Column(name="id_usuarios", nullable=false)
    private int idusuarios;
     @Column(name="titulo", nullable=false)
    private String titulo;
    
    @Column(name="id_categoria", nullable=false)
    private int idcategoria;
    
    @Column(name="longitude", nullable=false)
    private double longitude; 
    
    @Column(name="latitude", nullable=false)
    private double latitude;
    
    @Column(name="comentario", nullable=false)
    private String comentario;
    
    @Column(name="avaliacao", nullable=true)
    private double avaliacao;    

    @Column(name = "created", nullable = true)
    private Timestamp created;
    
    public int getId_post_usarios() {
        return id;
    }

    public void setId_post_usarios(int id) {        
        this.id = id;        
    }

    public int getId_usuarios() {
        return idusuarios;
    }

    public void setId_usuarios(int idusuarios) {        
        this.idusuarios = idusuarios;
        
    }

    public int getId_categoria() {
        return idcategoria;
    }

    public void setId_categoria(int idcategoria) {        
        this.idcategoria = idcategoria;
        
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {       
        this.longitude = longitude;
        
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {        
        this.latitude = latitude;
        
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {        
        this.comentario = comentario;        
    }

    public double getAvaliacao() {
        return avaliacao;
    }

    public void setAvaliacao(double avaliacao) {        
        this.avaliacao = avaliacao;        
    }
    
    public Timestamp getCreated() {
        return created;
    }

    public void setCreated(Timestamp created) {
        this.created = created;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

}
