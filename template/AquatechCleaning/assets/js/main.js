(function ($) {
  "use strict";

  /*==== Document Ready Function ====*/
  jQuery(document).ready(function($){
    // MOBILE MENU STARTS
    $("#main-menu").slicknav({
      allowParentLinks: true,
      prependTo: '#mobile-menu-wrap',
      label: '',
    });

    $(".mobile-menu-trigger").on("click", function(e) {
    $(".mobile-menu-container").addClass("menu-open");
    e.stopPropagation();
    });

    $(".mobile-menu-close").on("click", function(e) {
    $(".mobile-menu-container").removeClass("menu-open");
    e.stopPropagation();
    });
    // MOBILE MENU ENDS

    // open form
    $(".open-button").click(function(){
      $(".form-popup").show();
    });
    
    $(".btn-cancel").click(function(){
      $(".form-popup").hide();
    });
    // open form


    // Enable inline Background image
    $("[data-background]").each(function () {
      $(this).css("background-image", "url( " + $(this).attr("data-background") + " )");
    });

    // BANNER SLID STARTS 
    if ($('.banner-carousel').length) {
      $('.banner-carousel').owlCarousel({
          loop:true,
          margin:0,
          nav:true,
          animateOut: 'fadeOut',
          animateIn: 'fadeIn',
          active: true,
          smartSpeed: 1000,
          autoplay: 6000,
          navText: [ '<i class="fa-solid fa-arrow-left-long"></i>', '<i class="fa-solid fa-arrow-right-long"></i>' ],
          responsive:{
              0:{
                  items:1
              },
              600:{
                  items:1
              },
              800:{
                  items:1
              },
              1024:{
                  items:1
              }
          }
      });
    }
    // BANNER SLID ENDS

    // wow
    new WOW().init();


    // COUNTER STARTS 
    $('.counter').counterUp({
      delay: 10,
      time: 2000
    });
    // COUNTER ENDS

   
    // TESTIMONIAL STARTS
    if ($('.testimonial-slider').length) {
      $('.testimonial-slider').owlCarousel({
        loop:true,
        margin:30,
        nav:true,
        smartSpeed: 500,
        autoplay: 1000,
        navText: [ '<span class="fal fa-angle-left"></span>', '<span class="fal fa-angle-right"></span>' ],
        responsive:{
          0:{
            items:1
          },
          480:{
            items:1
          },
          600:{
            items:2
          },
          800:{
            items:2
          },			
          1200:{
            items:3
          }
  
        }
      });    		
    }
    // TESTIMONIAL ENDS

    // GALLERY STARTS
    $('.gallery-slide').slick({
      dots: false,
      infinite: true,
      speed: 1000,
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      arrows: false,
      responsive: [
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
      ]
    });
    // GALLERY ENDS

    // HOME TWO TESTIMONIAL STARTS
    if ($('.home-two-testimonial-slider').length) {
      $('.home-two-testimonial-slider').owlCarousel({
          loop:true,
          margin: 24,
          nav:true,
          smartSpeed: 1000,
          autoplay: 6000,
          navText: [ '<i class="fa-solid fa-arrow-left"></i>', '<i class="fa-solid fa-arrow-right"></i>' ],
          responsive:{
            0:{
              items:1
            },
            480:{
              items:1
            },
            600:{
              items:2
            },
            800:{
              items:3
            },			
            1200:{
              items:3
            }
                }
            });
        }
    // HOME TWO TESTIMONIAL STARTS

    // HOME THREE TESTIMONIAL STARTS
    $('.testimonial3-slider').slick({
      dots: false,
      infinite: true,
      speed: 1000,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      arrows: false,
      responsive: [
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
      ]
    });
    // HOME THREE TESTIMONIAL ENDS


    // BRAND STARTS
    $('.brand-logo').slick({
      dots: false,
      infinite: true,
      speed: 1000,
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      arrows: false,
      responsive: [
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        },
      ]
    });
    // BRAND ENDS


    // VIDEO POPUP
    $('.vedio-popup-link').magnificPopup({
      type: 'iframe'
    });
    // VIDEO POPUP


    //GALLERY
    $('.gallery-slide').magnificPopup({
      type: 'image',
      delegate:'a',
      gallery:{
        enabled:true
      }
    });

    $('.gallery-item-wrapper').magnificPopup({
      type: 'image',
      delegate:'a',
      gallery:{
        enabled:true
      }
    });
    //GALLERY


    //FOOTER GALLERY//LightBox / Fancybox
    if($('.lightbox-image').length) {
      $('.lightbox-image').fancybox({
        openEffect  : 'fade',
        closeEffect : 'fade',
        helpers : {
          media : {}
        }
      });
    }
    //FOOTER GALLERY

    



  });

 
  // Scroll To Top start
  $('.scroll-top-inner').on("click", function () {
    $('html, body').animate({scrollTop: 0}, 500);
    return false;
    });
    function handleScrollbar() {
        var progressLineBar = $('.scroll-top-inner .bar-inner');
        var pageHeight = $(document).height();
        var windwoHeight = $(window).height();
        var windowPos = $(window).scrollTop();
        var progressLineBarWidth = windowPos / (pageHeight - windwoHeight) * 100;
        $(progressLineBar).css('width',(progressLineBarWidth + '%'));
    }
    $(window).on('scroll', function() {
    handleScrollbar();
    if ($(window).scrollTop() > 200) {
        $('.scroll-top-inner').addClass('visible');
      } else {
        $('.scroll-top-inner').removeClass('visible');
      }
    });
  // Scroll To Top ends

 

 
  /*====  Window Load Function =====*/
  jQuery(window).on('load', function() {
    //Preloader
    $('.loader-wrap').delay(2000).fadeOut('slow');
      setTimeout(function() {
          $('.site').addClass('loaded');
      }, 500);
   
  });
    

}(jQuery));


 