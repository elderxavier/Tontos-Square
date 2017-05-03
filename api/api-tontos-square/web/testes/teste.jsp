<%-- 
    Document   : teste
    Created on : 2/mai/2017, 6:35:24
    Author     : elder
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="es.esy.elderxavier.model.Testes"%>
<%@page import="es.esy.elderxavier.model.Helpers"%>

<%
    Helpers teste = new Helpers();
    String s = teste.cryptWithMD5("1234567890abcdefghij");
    response.getWriter().println(s);
    
s = teste.cryptWithMD5("1234567890");
    response.getWriter().println(s);

%>
