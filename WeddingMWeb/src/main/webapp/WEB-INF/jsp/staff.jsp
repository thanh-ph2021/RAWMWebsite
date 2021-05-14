<%-- 
    Document   : Staff
    Created on : 14 May 2021, 2:54:53 am
    Author     : ASUS
--%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>

<c:url value="/admin/staff" var="action"/>
<!-- DataTales Example -->
<div class="card shadow mb-4">
    <div class="card-header py-3 d-flex justify-content-between bd-highlight mb-3">
        <div class="p-2"><h6 class="m-0 font-weight-bold text-primary">Staff</h6></div>
        <div class="p-2">
            <form:form class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search" method="post" action="${action}" modelAttribute="staffs">
                <div class="input-group">
                    <form:input type="text" class="form-control bg-light border-0 small" placeholder="enter staff name ..."
                           aria-label="Search" aria-describedby="basic-addon2" path="name"/>
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="submit">
                            <i class="fas fa-search fa-sm"></i>
                        </button>
                    </div>
                </div>
            </form:form>
        </div>
        <div class="p-2"><a href="<c:url value="/admin/staff/add" />" 
                            class="btn btn-info">New Record</a></div>


    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Sex</th>
                    <th>Birthday</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Position</th>
                    <th>Service</th>
                </tr>
                <c:forEach items="${staff}" var="st">
                    <tr id="staff${st.id}" style="font-size: 13px">
                        <td>${st.id}</td>
                        <td>${st.name}</td>
                        <td>${st.sex}</td>
                        <td>${st.birthday}</td>
<!--                        <td>${st.birthday.getMonth()}-${st.birthday.getDay()}-${st.birthday.getYear()}</td>-->
                        <td>${st.phone}</td>
                        <td>${st.email}</td>
                        <td>${st.address}</td>
                        <td>${st.position.name}</td>
                        <td>
                            <a class="btn btn-danger" href="javascript:;" aria-label="Delete" title="Delete" onclick="deleteStaff(${st.id})">
                                <i class="fas fa-trash fa-2" aria-hidden="true"></i>
                            </a>
                            <a class="btn btn-primary" href="<c:url value="/admin/staff/add" />/?staffId=${st.id}" aria-label="Edit" title="Edit">
                                <i class="fas fa-pen" aria-hidden="true"></i>
                            </a>
                        </td>



                    </tr>
                </c:forEach>


            </table>
        </div>
    </div>
</div>
