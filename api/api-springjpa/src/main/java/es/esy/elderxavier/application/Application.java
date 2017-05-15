package es.esy.elderxavier.application;
   
  import org.springframework.boot.SpringApplication;
  import org.springframework.boot.autoconfigure.SpringBootApplication;
  import org.springframework.boot.orm.jpa.EntityScan;
  import org.springframework.context.annotation.ComponentScan;
  import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
   
  @SpringBootApplication
  @EntityScan(basePackages = { "es.esy.elderxavier.entity" })
  @EnableJpaRepositories(basePackages = { "es.esy.elderxavier.repository" })
  @ComponentScan(basePackages = {"es.esy.elderxavier.controller"})
  public class Application {
        public static void main(String[] args) {
              SpringApplication.run(Application.class, args);
        }
  }