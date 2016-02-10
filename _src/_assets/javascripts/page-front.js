
//=include bigchain/hero-video.js
//=include bigchain/smoothscroll.js
//=include ../../../node_modules/vivus/dist/vivus.js


jQuery(function($) {

    // hero stuff
    HeroVideo.init();

    $('.hero .logo').on('animationend webkitAnimationEnd oAnimationEnd',
        function(e) {
            $('.hero').addClass('is-ready');
        }
    );

    // graph animation
    var iconOptions = {
        type: 'async',
        start: 'inViewport',
        duration: 200,
        animTimingFunction: Vivus.EASE_OUT,
        selfDestroy: true
    };

    new Vivus('bigchain-graph', iconOptions);

});
