<%-- 
    Document   : add
    Created on : 14 May 2021, 7:20:16 pm
    Author     : ASUS
--%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="form"
           uri="http://www.springframework.org/tags/form" %>

<%@taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<c:url value="/admin/staff/add" var="action" />
<section class="ftco-section" style="padding: 0px">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-5">
                <div class="wrap d-md-flex">

                    <div class="login-wrap p-4 p-lg-10" style="width: 100%">
                        <c:if test="${param.staffId != null}">
                            <div class="d-flex">
                                <div class="w-100">
                                    <h3 class="label mb-4">Edit A Record Staff</h3>
                                </div>

                            </div>
                        </c:if>
                        <c:if test="${param.staffId == null}">
                            <div class="d-flex">
                                <div class="w-100">
                                    <h3 class="label mb-4">New A Record Staff</h3>
                                </div>

                            </div>
                        </c:if>
                        <form:form method="post" 
                                   action="${action}"
                                   modelAttribute="staffs">
                            <form:errors path="*" element="div" 
                                         cssClass="alert alert-danger" />
                            <div class="form-group mb-3">
                                <label class="label"><spring:message code="staff.name" /></label>
                                <form:input cssClass="form-control" path="name" type="text"/>
                            </div>
                            <div class="form-group mb-3">
                                <label class="label"><spring:message code="staff.sex" /></label>
                                <form:select path="sex" cssClass="form-control">
                                    <option selected value="male">male</option>
                                    <option value="female">female</option>
                                    <option value="other">other</option>
                                </form:select> 
                            </div>
                            <div class="form-group mb-3">
                                <label class="label"><spring:message code="staff.birthday" /></label>
                                <form:input cssClass="form-control" path="birthday" type="date"/>
                            </div>
                            <div class="form-group mb-3">
                                <label class="label"><spring:message code="staff.phone" /></label>
                                <form:input cssClass="form-control" path="phone" type="text"/>
                            </div>
                            <div class="form-group mb-3">
                                <label class="label"><spring:message code="staff.email" /></label>
                                <form:input cssClass="form-control" path="email" type="email"/>
                            </div>
                            <div class="form-group mb-3">
                                <label class="label"><spring:message code="staff.address" /></label>
                                <form:input cssClass="form-control" path="address" type="text"/>
                            </div>
                            <div class="form-group mb-3">
                                <label class="label"><spring:message code="staff.position" /> </label>
                                <form:select path="position" cssClass="form-control">
                                    <c:forEach items="${positions}" var="pos">
                                        <c:if test="${pos.id == staffs.position.id}">
                                            <option selected value="${pos.id}">${pos.name}</option>
                                        </c:if>
                                        <c:if test="${pos.id != staffs.position.id}">
                                            <option value="${pos.id}">${pos.name}</option>
                                        </c:if>
                                    </c:forEach>
                                </form:select>
                            </div>
                            <c:if test="${param.staffId == null}">
                                <div>
                                    <form:hidden path="id" />
                                    <input type="submit" class="form-control btn btn-primary submit px-3" value="<spring:message code="staff.submit" />" />
                                </div>
                            </c:if>
                                <c:if test="${param.staffId != null}">
                                <div>
                                    <form:hidden path="id" />
                                    <input type="submit" class="form-control btn btn-primary submit px-3" value="Edit staff" />
                                </div>
                            </c:if>
                            

                        </form:form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>


