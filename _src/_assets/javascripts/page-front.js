
//=include bigchain/hero-video.js
//=include bigchain/smoothscroll.js
//=include bigchain/testimonials.js

jQuery(function($) {

    // hero stuff
    HeroVideo.init();

    $('.hero .logo').on('animationend webkitAnimationEnd oAnimationEnd',
        function(e) {
            $('.hero').addClass('is-ready');
        }
    );

    Testimonials.init();

});
