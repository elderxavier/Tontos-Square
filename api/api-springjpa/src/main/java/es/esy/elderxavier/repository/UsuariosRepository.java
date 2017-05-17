package es.esy.elderxavier.repository;
   
  import java.util.List;
  import org.springframework.data.jpa.repository.JpaRepository;
   
  import es.esy.elderxavier.entity.Usuarios;
   
  public interface UsuariosRepository extends JpaRepository<Usuarios, Long> {
      
        Usuarios findById(int id);
        
        List<Usuarios> findByEmailAndSenha(String email, String senha);
      
        /**
         * Encontra todos os livros de um mesmo autor.
         * 
         * @param autor
         * @return lista de livros
         */
       // List<Usuarios> findByAutor(String autor);
        
        /**
    * Encontra um livro a partir do seu título. 
   * Retorna uma lista pois podem existir
         * mais de um livro com mesmo título.
         * 
         * @param titulo
         * @return lista de livros
         */
        //List<Usuarios> findByTitulo(String titulo);
        
        /**
  * Encontra um livro a partir de seu isbn, como o isbn é único, apenas um livro pode ser encontrado. 
         * 
         * @param isbn
         * @return livro
         */
        //Usuarios findByIsbn(String isbn);
   
  }