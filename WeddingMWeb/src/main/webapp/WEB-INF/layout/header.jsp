<%-- 
    Document   : header
    Created on : 8 May 2021, 8:19:13 pm
    Author     : ASUS
--%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>

<header class="header-area header-sticky">
    <div class="container">
        <div class="row">
            <div class="col-12">
                <nav class="main-nav">
                    <!-- ***** Logo Start ***** -->
                    <a href="<c:url value="/"/>" class="logo">
                        <img src="<c:url value="/images/logo.png"/>" align="klassy cafe html template">
                    </a>
                    <!-- ***** Logo End ***** -->
                    <!-- ***** Menu Start ***** -->
                    <ul class="nav">
                        <li class="scroll-to-section"><a href="<c:url value="/"/>" class="active">Home</a></li>
                        <li class="scroll-to-section"><a href="<c:url value="/about"/>">About</a></li>

                        <!-- 
                            <li class="submenu">
                                <a href="javascript:;">Drop Down</a>
                                <ul>
                                    <li><a href="#">Drop Down Page 1</a></li>
                                    <li><a href="#">Drop Down Page 2</a></li>
                                    <li><a href="#">Drop Down Page 3</a></li>
                                </ul>
                            </li>
                        -->
                        <li class="submenu">
                            <a href="javascript:;">Service</a>
                            <ul>
                                <c:forEach items="${services}" var="s">
                                    <li><a href="#">${s.name}</a></li>
                                    </c:forEach>
                            </ul>
                        </li>
                        <li class="scroll-to-section"><a href="#chefs">Menu</a></li> 
                        <li class="submenu">
                            <a href="javascript:;">Hall</a>
                            <ul>
                                <c:forEach items="${halls}" var="h">
                                    <li><a href="#">${h.name}</a></li>
                                    </c:forEach>

                            </ul>
                        </li>
                        <!-- <li class=""><a rel="sponsored" href="https://templatemo.com" target="_blank">External URL</a></li> -->
                        <li class="scroll-to-section" style="background: #b5b5b3; padding: 0 15px; border-radius: 5px"><a href="#reservation">Contact Us</a></li>
<!--                        <li class="submenu">
                            <a href="javascript:;">User  <i class="fas fa-user"></i></a>
                            <ul>
                                <li><a href="#"><i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                        Profile</a></li>
                                <li>

                                    <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                                        <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                        Logout
                                    </a>
                                </li>

                            </ul>
                        </li>-->
                    </ul>        
                    <a class='menu-trigger'>
                        <span>Menu</span>
                    </a>
                    <!-- ***** Menu End ***** -->
                </nav>
            </div>
        </div>
    </div>
</header>