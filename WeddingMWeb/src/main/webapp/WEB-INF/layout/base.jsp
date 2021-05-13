<%-- 
    Document   : base
    Created on : 2 Apr 2021, 11:00:08 pm
    Author     : ASUS
--%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="tiles"
          uri="http://tiles.apache.org/tags-tiles" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>
            <tiles:insertAttribute name="title" />
        </title>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <link href="https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="fonts/material-design-iconic-font/css/material-design-iconic-font.min.css">
        <!--css-login-->
        <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="<c:url value="/css/style.css"/>">
        <!--css-login-->

        <link rel="stylesheet" href="<c:url value="/css/templatemo-klassy-cafe.css"/>">

        <link rel="stylesheet" href="<c:url value="/css/owl-carousel.css"/>">

        <link rel="stylesheet" href="<c:url value="/css/lightbox.css"/>">

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    </head>
    <body>
        <!-- header -->
        <tiles:insertAttribute name="header" />

        <!-- content -->
        <tiles:insertAttribute name="content" />

        <!-- footer -->
        <tiles:insertAttribute name="footer" />
    </body>
</html>
