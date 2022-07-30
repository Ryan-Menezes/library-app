$(document).ready(function() {
    $('.categories.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
            },
            600:{
                items: 2,
            },
            1000:{
                items: 4,
            },
        },
    });

    $('.authors.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        responsive: {
            0:{
                items: 1,
            },
            600:{
                items: 2,
            },
            800:{
                items: 3,
            },
            1000:{
                items: 4,
            },
        },
    });

    $('.books.owl-carousel').owlCarousel({
        loop: true,
        margin: 30,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        center: true,
        responsive: {
            0: {
                items: 1,
            },
            600:{
                items: 3,
            },
            1000:{
                items: 6,
            },
        },
    });

    $('.book-gallery.owl-carousel').owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: false,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        responsive: {
            0:{
                items: 1,
            },
            600:{
                items: 2,
            },
            800:{
                items: 3,
            },
            1000:{
                items: 4,
            },
        },
    });

    $('.book-gallery img').click(function() {
        $('.books-img').attr('src', $(this).attr('src'));
    })
});
