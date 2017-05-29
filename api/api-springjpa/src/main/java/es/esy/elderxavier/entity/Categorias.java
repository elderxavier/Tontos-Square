package es.esy.elderxavier.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity(name = "categorias")
@Table(name = "categorias")
public class Categorias {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="id_categoria", nullable=false)
    private int id;
    
    @Column(name="nome", nullable=false)
    private String nome;
    
    @Column(name="parent", nullable=false)
    private int parent;

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

    public int getParent() {
        return parent;
    }

    public void setParent(int parent) {
        this.parent = parent;
    }
}
