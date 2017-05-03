/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package es.esy.elderxavier.dao;

import es.esy.elderxavier.db.ConexaoDB;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.Date;

/**
 *
 * @author elder
 */
public class Dao {

    static Connection conexao = ConexaoDB.getConexao();

    public Dao() {

    }

    public void SetUsuario(String nome, String email, String senha) {
        try {
            String sql = "INSERT INTO `tontos_square_db`.`usuarios` (nome, email, senha)"
                    + "VALUES(?,?,?)";

            PreparedStatement stmt = conexao.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setString(1, nome);
            stmt.setString(2, email);
            stmt.setString(3, senha);

        } catch (SQLException ex) {
            Logger.getLogger(Dao.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public static List<String[]> getUsuario(String email, String senha) {
        List<String[]> minhalista = new ArrayList<String[]>();
        try {
            Timestamp timestamp = null;
            Date date = null;
            String sql = "SELECT * FROM patrimonio";

            PreparedStatement stmt = conexao.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ResultSet rs = stmt.executeQuery();
            String[] row = null;
            while (rs.next()) {
                row = new String[10];
                row[0] = String.valueOf(rs.getInt("id_usuarios"));
                row[1] = rs.getString("nome");
                row[2] = rs.getString("email");
                row[3] = rs.getString("senha");

                timestamp = rs.getTimestamp("created");
                date = null;
                if (timestamp != null) {
                    date = new Date(timestamp.getTime());
                }
                row[4] = String.valueOf(date);
                timestamp = rs.getTimestamp("updated");
                if (timestamp != null) {
                    date = new Date(timestamp.getTime());
                }
                row[5] = String.valueOf(date);
                minhalista.add(row);
            }
            rs.close();
            stmt.close();
        } catch (Exception ex) {
            Logger.getLogger(Dao.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            return minhalista;
        }

    }
}
