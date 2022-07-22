$(document).ready(function() {
    $('.authors').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        responsive:{
            0:{
                items: 1,
            },
            600:{
                items: 3,
            },
            1000:{
                items: 4,
            },
        },
    });

    $('.books').owlCarousel({
        loop: true,
        margin: 30,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        center: true,
        responsive:{
            0:{
                items: 1,
            },
            800:{
                items: 3,
            },
            1000:{
                items: 6,
            },
        },
    });
});
