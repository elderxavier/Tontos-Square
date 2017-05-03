package es.esy.elderxavier.db;

/**
 *
 * @author elder Xavier
 */
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexaoDB {

    public static String status = "Não conectou...";

    public static Connection getConexao() {
        Connection connection = null;
        try {
            String driverName = "com.mysql.jdbc.Driver";
            Class.forName(driverName);
            String serverName = "31.220.59.87";
            String mydatabase = "tontos_square_db";
            String url = "jdbc:mysql://" + serverName + "/" + mydatabase;
            String username = "root";
            String password = "mysql321!";
            connection = DriverManager.getConnection(url, username, password);
            if (connection != null) {
                status = ("Conectado com sucesso!");
            } else {
                status = ("Não foi possivel realizar conexão");
            }
            return connection;
        } catch (ClassNotFoundException e) {
            System.out.println("O driver expecificado nao foi encontrado.");
            return null;
        } catch (SQLException e) { //Não conseguindo se conectar ao banco 
            System.out.println("Nao foi possivel conectar ao Banco de Dados.");
            return null;
        }
    }

    public static String statusConection() {
        return status;
    }

    public static boolean FecharConexao() {
        try {
            ConexaoDB.getConexao().close();
            status = ("Conexão finalizada pelo usuário");
            return true;
        } catch (SQLException e) {
            return false;
        }
    }

    public static java.sql.Connection ReiniciarConexao() {
        FecharConexao();
        return ConexaoDB.getConexao();
    }
}
