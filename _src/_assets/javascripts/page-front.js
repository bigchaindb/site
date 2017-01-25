
//=include bigchain/smoothscroll.js
//=include bigchain/testimonials.js

jQuery(function($) {

    // hero stuff
    $('.hero .logo').on('animationend webkitAnimationEnd oAnimationEnd',
        function(e) {
            $('.hero').addClass('is-ready');
        }
    );

    Testimonials.init();

});
