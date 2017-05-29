package es.esy.elderxavier.repository;

import es.esy.elderxavier.entity.Categorias;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CategoriasRepository extends JpaRepository<Categorias, Long>{
   
    List<Categorias> findByParent(int parent);
    @Override
    List<Categorias> findAll();
    
    
}
