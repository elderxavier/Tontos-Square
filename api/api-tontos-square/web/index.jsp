<%-- 
    Document   : index
    Created on : 2/mai/2017, 2:52:29
    Author     : elder
--%>


<%@ page import="es.esy.elderxavier.db.ConexaoDB" %>
<%@page import="java.io.PrintWriter"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%//@include file="abc.jsp" %>

<% 
    //
    
    String j = "{'menu': { 'header': 'SVG Viewer', 'items': [ {'id': 'Open'}, {'id': 'OpenNew', 'label': 'Open New'}, null, {'id': 'ZoomIn', 'label': 'Zoom In'}, {'id': 'ZoomOut', 'label': 'Zoom Out'}, {'id': 'OriginalView', 'label': 'Original View'}, null, {'id': 'Quality'}, {'id': 'Pause'}, {'id': 'Mute'}, null, {'id': 'Find', 'label': 'Find...'}, {'id': 'FindAgain', 'label': 'Find Again'}, {'id': 'Copy'}, {'id': 'CopyAgain', 'label': 'Copy Again'}, {'id': 'CopySVG', 'label': 'Copy SVG'}, {'id': 'ViewSVG', 'label': 'View SVG'}, {'id': 'ViewSource', 'label': 'View Source'}, {'id': 'SaveAs', 'label': 'Save As'}, null, {'id': 'Help'}, {'id': 'About', 'label': 'About Adobe CVG Viewer...'} ] }}";
    response.setContentType("application/json"); 
PrintWriter saida = response.getWriter();
//saida.println(j.toString());

ConexaoDB.getConexaoMySQL();
saida.println(ConexaoDB.statusConection());
ConexaoDB.FecharConexao();
saida.println(ConexaoDB.statusConection());
/*
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
        <h1>Hello World!</h1>
    </body>
</html>
*/
//request.getRequestDispatcher("/banner.jsp").include(request, response);
%>