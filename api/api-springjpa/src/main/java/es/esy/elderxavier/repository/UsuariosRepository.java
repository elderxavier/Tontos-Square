package es.esy.elderxavier.repository;
   
  import java.util.List;
  import org.springframework.data.jpa.repository.JpaRepository;
   
  import es.esy.elderxavier.entity.Usuarios;
   
  public interface UsuariosRepository extends JpaRepository<Usuarios, Long> {
      
        Usuarios findById(int id);
        
        List<Usuarios> findByEmailAndSenha(String email, String senha);     
        
   
  }