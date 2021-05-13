<%-- 
    Document   : sign-up
    Created on : 12 May 2021, 2:08:12 pm
    Author     : ASUS
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>

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
                        <form action="#" class="">
                            <div class="form-group mb-3">
                                <label class="label" for="name">Username</label>
                                <input type="text" class="form-control myform" placeholder="Username" required>
                            </div>
                            <div class="form-group mb-3">
                                <label class="label" for="password">Password</label>
                                <input type="password" class="form-control myform" placeholder="Password" required>
                            </div>
                            <div class="form-group mb-3">
                                <label class="label" for="password">Confirm Password</label>
                                <input type="password" class="form-control myform" placeholder="Confirm Password" required>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="form-control btn btn-primary submit px-3">Sign up</button>
                            </div>
                            
                        </form>
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