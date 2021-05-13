<%-- 
    Document   : index
    Created on : 9 May 2021, 3:41:16 pm
    Author     : ASUS
--%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>

<!-- ***** Preloader Start ***** -->
<div id="preloader">
    <div class="jumper">
        <div></div>
        <div></div>
        <div></div>
    </div>
</div>  
<!-- ***** Preloader End ***** -->

<!-- ***** Main Banner Area Start ***** -->
<div id="top">
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-4">
                <div class="left-content">
                    <div class="inner-content">
                        <h4>Wedding</h4>
                        <h6>THE BEST EXPERIENCE</h6>
                        <div class="row">
                            <div class="main-white-button scroll-to-section col-lg-5">
                                <a href="<c:url value="/login"/>">Login</a>
                            </div>
                            <div class="main-white-button scroll-to-section col-lg-7">
                                <a href="<c:url value="/sign-up"/>">Sign up</a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="col-lg-8">
                <div class="main-banner header-text">
                    <div class="Modern-Slider">
                        <!-- Item -->
                        <div class="item">
                            <div class="img-fill">
                                <img src="<c:url value="/images/slide_01.jpg"/>" alt="">
                            </div>
                        </div>
                        <!-- // Item -->
                        <!-- Item -->
                        <div class="item">
                            <div class="img-fill">
                                <img src="<c:url value="/images/slide_02.jpg"/>" alt="">
                            </div>
                        </div>
                        <!-- // Item -->
                        <!-- Item -->
                        <div class="item">
                            <div class="img-fill">
                                <img src="<c:url value="/images/slide_03.jpg"/>" alt="">
                            </div>
                        </div>
                        <div class="item">
                            <div class="img-fill">
                                <img src="<c:url value="/images/slide_04.jpg"/>" alt="">
                            </div>
                        </div>
                        <div class="item">
                            <div class="img-fill">
                                <img src="<c:url value="/images/slide_05.jpg"/>" alt="">
                            </div>
                        </div>
                        <!-- // Item -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- ***** Main Banner Area End ***** -->

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

<!-- ***** Menu Area Starts ***** 
<section class="section" id="menu">
    <div class="container">
        <div class="row">
            <div class="col-lg-4">
                <div class="section-heading">
                    <h6>Our Service</h6>
                    <h2>We provide perfect services</h2>
                </div>
            </div>
        </div>
    </div>
    <div class="menu-item-carousel">
        <div class="col-lg-12">
            <div class="owl-menu-item owl-carousel">
                <div class="item">
                    <div class='card card1'>
                        <div class="price"><h6>$14</h6></div>
                        <div class='info'>
                            <h1 class='title'>Chocolate Cake</h1>
                            <p class='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sedii do eiusmod teme.</p>
                            <div class="main-text-button">
                                <div class="scroll-to-section"><a href="#reservation">Make Reservation <i class="fa fa-angle-down"></i></a></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class='card card2'>
                        <div class="price"><h6>$22</h6></div>
                        <div class='info'>
                            <h1 class='title'>Klassy Pancake</h1>
                            <p class='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sedii do eiusmod teme.</p>
                            <div class="main-text-button">
                                <div class="scroll-to-section"><a href="#reservation">Make Reservation <i class="fa fa-angle-down"></i></a></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class='card card3'>
                        <div class="price"><h6>$18</h6></div>
                        <div class='info'>
                            <h1 class='title'>Tall Klassy Bread</h1>
                            <p class='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sedii do eiusmod teme.</p>
                            <div class="main-text-button">
                                <div class="scroll-to-section"><a href="#reservation">Make Reservation <i class="fa fa-angle-down"></i></a></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class='card card4'>
                        <div class="price"><h6>$10</h6></div>
                        <div class='info'>
                            <h1 class='title'>Blueberry CheeseCake</h1>
                            <p class='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sedii do eiusmod teme.</p>
                            <div class="main-text-button">
                                <div class="scroll-to-section"><a href="#reservation">Make Reservation <i class="fa fa-angle-down"></i></a></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class='card card5'>
                        <div class="price"><h6>$8.50</h6></div>
                        <div class='info'>
                            <h1 class='title'>Klassy Cup Cake</h1>
                            <p class='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sedii do eiusmod teme.</p>
                            <div class="main-text-button">
                                <div class="scroll-to-section"><a href="#reservation">Make Reservation <i class="fa fa-angle-down"></i></a></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class='card card3'>
                        <div class="price"><h6>$7.25</h6></div>
                        <div class='info'>
                            <h1 class='title'>Klassic Cake</h1>
                            <p class='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sedii do eiusmod teme.</p>
                            <div class="main-text-button">
                                <div class="scroll-to-section"><a href="#reservation">Make Reservation <i class="fa fa-angle-down"></i></a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
 ***** Menu Area Ends ***** -->


<!-- ***** Reservation Us Area Starts ***** -->
<section class="section" id="reservation">
    <div class="container">
        <div class="row">
            <div class="col-lg-6 align-self-center">
                <div class="left-text-content">
                    <div class="section-heading">
                        <h6>Contact Us</h6>
                        <h2>Fill out the wedding reservation information link system below for advice and get the best value</h2>
                    </div>
                    <p></p>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="phone">
                                <i class="fa fa-phone"></i>
                                <h4>Phone Numbers</h4>
                                <span><a href="#">080-090-0990</a></span>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="message">
                                <i class="fa fa-envelope"></i>
                                <h4>Emails</h4>
                                <span><a href="#">wed@company.com</a></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="contact-form">
                    <form id="contact" action="" method="post">
                        <div class="row">
                            <div class="col-lg-12">
                                <h4>Wedding Party Reservation</h4>
                            </div>
                            <div class="col-lg-6 col-sm-12">
                                <fieldset>
                                    <input name="name" type="text" id="name" placeholder="Your Name*" required="">
                                </fieldset>
                            </div>
                            <div class="col-lg-6 col-sm-12">
                                <fieldset>
                                    <input name="email" type="text" id="email" pattern="[^ @]*@[^ @]*" placeholder="Your Email Address" required="">
                                </fieldset>
                            </div>
                            <div class="col-lg-6 col-sm-12">
                                <fieldset>
                                    <input name="phone" type="text" id="phone" placeholder="Phone Number*" required="">
                                </fieldset>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <input  name="number-of-table" id="date" type="number" class="form-control" placeholder="Number Of Table">
                            </div>
                            <div class="col-lg-6">
                                <div id="filterDate2">    
                                    <div class="input-group date" data-date-format="dd/mm/yyyy">
                                        <input  name="organization-date" id="date" type="text" class="form-control" placeholder="Organization date">
                                        <div class="input-group-addon" >
                                            <span class="glyphicon glyphicon-th"></span>
                                        </div>
                                    </div>
                                </div>   
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <fieldset>
                                    <select value="time" name="time" id="time">
                                        <option value="time">Time</option>
                                        <option name="morning" id="Breakfast">7:00</option>
                                        <option name="afternoon" id="Lunch">12:00</option>
                                        <option name="evening" id="Dinner">19:00</option>
                                    </select>
                                </fieldset>
                            </div>
                            <div class="col-lg-12">
                                <fieldset>
                                    <textarea name="message" rows="6" id="message" placeholder="Message" required=""></textarea>
                                </fieldset>
                            </div>
                            <div class="col-lg-12">
                                <fieldset>
                                    <button type="submit" id="form-submit" class="main-button-icon">Send</button>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- ***** Reservation Area Ends ***** -->


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
