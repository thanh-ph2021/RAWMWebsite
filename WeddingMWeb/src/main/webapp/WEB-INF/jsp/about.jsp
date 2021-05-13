<%-- 
    Document   : about
    Created on : 13 May 2021, 10:25:15 pm
    Author     : ASUS
--%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!-- ***** About Area Starts ***** -->
<section class="section" id="about">
    <div class="container">
        <div class="row">
            <div class="col-lg-6 col-md-6 col-xs-12">
                <div class="left-text-content">
                    <div class="section-heading">
                        <h6>About Us</h6>
                        <h2>We Leave A Delicious Memory For You</h2>
                    </div>
                    <p>WED is a world-class wedding conference center system designed with a sophisticated, unique architecture with luxurious and classy space.  With top quality professional services, we will light up sweet feelings for a happy day and bring great materials to continue writing endless love stories.  <br><br>Developed and operated by a team of enthusiastic, professional and experienced personnel, WED is the place to mark happiness and bring full success to your big event.</p>
                    <div class="row">
                        <div class="col-4">
                            <img src="<c:url value="/images/about_01.jpg"/>" alt="">
                        </div>
                        <div class="col-4">
                            <img src="<c:url value="/images/about_02.jpg"/>" alt="">
                        </div>
                        <div class="col-4">
                            <img src="<c:url value="/images/about_03.jpg"/>" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 col-md-6 col-xs-12">
                <div class="right-content">
                    <div class="thumb">
                        <a rel="nofollow" href="http://youtube.com"><i class="fa fa-play"></i></a>
                        <img src="<c:url value="/images/about_video_bg.jfif"/>" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- ***** About Area Ends ***** -->


<!-- jQuery -->
<script src="<c:url value="/js/jquery-2.1.0.min.js"/>"></script>

<!-- Bootstrap -->
<script src="<c:url value="/js/popper.js"/>"></script>
<script src="<c:url value="/js/bootstrap.min.js"/>"></script>

<!-- Plugins -->
<script src="<c:url value="/js/owl-carousel.js"/>"></script>
<script src="<c:url value="/js/accordions.js"/>"></script>
<script src="<c:url value="/js/datepicker.js"/>"></script>
<script src="<c:url value="/js/scrollreveal.min.js"/>"></script>
<script src="<c:url value="/js/waypoints.min.js"/>"></script>
<script src="<c:url value="/js/jquery.counterup.min.js"/>"></script>
<script src="<c:url value="/js/imgfix.min.js"/>"></script> 
<script src="<c:url value="/js/slick.js"/>"></script> 
<script src="<c:url value="/js/lightbox.js"/>"></script> 
<script src="<c:url value="/js/isotope.js"/>"></script> 

<!-- Global Init -->
<script src="<c:url value="/js/custom.js"/>"></script>
<script>

    $(function () {
        var selectedClass = "";
        $("p").click(function () {
            selectedClass = $(this).attr("data-rel");
            $("#portfolio").fadeTo(50, 0.1);
            $("#portfolio div").not("." + selectedClass).fadeOut();
            setTimeout(function () {
                $("." + selectedClass).fadeIn();
                $("#portfolio").fadeTo(50, 1);
            }, 500);

        });
    });

</script>