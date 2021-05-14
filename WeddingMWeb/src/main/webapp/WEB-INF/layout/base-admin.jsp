
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
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet" type="text/css">
        <link
            href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
            rel="stylesheet">

        <!-- Custom styles for this template-->
        <link href="<c:url value="/css/sb-admin-2.min.css"/>" rel="stylesheet">
        <!--css-login-->
        <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,900&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="<c:url value="/css/style.css"/>">
        <!--css-login-->
    </head>
    <body id="page-top">
        <div id="wrapper " class="row">
            <!-- sidebar -->
            <ul class="navbar-nav sidebar sidebar-dark accordion col-2" id="accordionSidebar" style="background-color: #fb5849">
                <tiles:insertAttribute name="sidebar" />
            </ul>
            <div id="content-wrapper" class="d-flex col-10">
                <div id="content" style="width: 100%">
                    <!-- topbar -->
                    <tiles:insertAttribute name="topbar" />
                    <!-- content -->
                    <tiles:insertAttribute name="content" />
                </div>
            </div>

        </div>
        <script src="<c:url value="/js/jquery.min.js"/>"></script>
        <script src="<c:url value="/js/bootstrap.bundle.min.js"/>"></script>

        <!-- Core plugin JavaScript-->
        <script src="<c:url value="/js/jquery.easing.min.js"/>"></script>

        <!-- Custom scripts for all pages-->
        <script src="<c:url value="/js/sb-admin-2.min.js"/>"></script>

        <!-- Page level plugins -->
        <script src="<c:url value="/js/Chart.min.js"/>"></script>

        <!-- Page level custom scripts -->
        <script src="<c:url value="/js/chart-area-demo.js"/>"></script>
        <script src="<c:url value="/js/chart-pie-demo.js"/>"></script>
        <script src="<c:url value="/js/main.js"/>"></script>
    </body>
</html>
