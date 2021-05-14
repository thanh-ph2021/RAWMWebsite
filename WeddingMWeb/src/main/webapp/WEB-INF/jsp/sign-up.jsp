<%-- 
    Document   : sign-up
    Created on : 12 May 2021, 2:08:12 pm
    Author     : ASUS
--%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>

<c:url value="/sign-up" var="action"/>
<section class="ftco-section">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6 text-center mb-5">
                <h2 class="heading-section"></h2>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-5">
                <div class="wrap d-md-flex">
                    
                    <div class="login-wrap p-4 p-lg-10" style="width: 100%">
                        <div class="d-flex">
                            <div class="w-100">
                                <h3 class="mb-4">Sign up</h3>
                            </div>
                            
                        </div>
                        <form:form action="${action}" class="" method="post" modelAttribute="user">
                            <form:errors path="*" element="div" 
                                         cssClass="alert alert-danger" />
                            <c:if test="${errorMsg != null}">
                                <div class="alert alert-danger">${errorMsg}</div>
                            </c:if>

                            <div class="form-group mb-3">
                                <label class="label" for="phone">Phone</label>
                                <form:input type="text" class="form-control myform" placeholder="Phone" required="required" path="phone"/>
                            </div>
                            <div class="form-group mb-3">
                                <label class="label" for="name">Username</label>
                                <form:input type="text" class="form-control myform" placeholder="Username" required="required" path="userName"/>
                            </div>
                            <div class="form-group mb-3">
                                <label class="label" for="password">Password</label>
                                <form:input type="password" class="form-control myform" placeholder="Password" required="required" path="pass"/>
                            </div>
                            <div class="form-group mb-3">
                                <label class="label" for="password">Confirm Password</label>
                                <form:input type="password" class="form-control myform" placeholder="Confirm Password" required="required" path="confirmPassword"/>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="form-control btn btn-primary submit px-3">Sign up</button>
                            </div>
                            
                        </form:form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>


<script src="<c:url value="js/jquery.min.js"/>"></script>
<script src="<c:url value="js/popper.js"/>"></script>
<script src="<c:url value="js/bootstrap.min.js"/>"></script>
<script src="<c:url value="js/main.js"/>"></script>