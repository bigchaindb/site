
//=include ../../../node_modules/is-in-viewport/lib/isInViewport.js

jQuery(function($) {

    var wrigely     = $('#wrigely'),
        wrigelyArm  = wrigely.find('#arm'),
        wrigelyHead = wrigely.find('#head'),
        wrigelyEye  = wrigely.find('#eye');

    var wrigelyAnimationStart = function() {

        // set utility classes
        if (wrigely.is( ':in-viewport( -180 )' ) ) {
            wrigely.addClass('is-ready');

            // toggle paused class so the :hover interaction can fire animation again
            wrigelyArm.on('animationend webkitAnimationEnd oAnimationEnd', function(e) {
                    wrigelyArm.addClass('paused');
                    wrigelyHead.addClass('paused');

                    wrigely.on('mouseover', function() {
                        wrigelyArm.removeClass('paused');
                        wrigelyHead.removeClass('paused');
                    });

                    // fire eye blinking once other animations have finished
                    wrigelyEye.addClass('is-ready');

                    wrigelyEye.on('animationend webkitAnimationEnd oAnimationEnd', function(e) {
                        wrigelyEye.removeClass('is-ready');
                    });
                }
            );
        } else {
            wrigely.removeClass('is-ready').removeClass('paused');
            wrigelyArm.removeClass('paused');
            wrigelyHead.removeClass('paused');
            wrigelyEye.removeClass('is-ready').removeClass('paused');
        }
    }

    // fire all the viewport things
    wrigelyAnimationStart();
    $(window).on('load resize scroll', wrigelyAnimationStart);

});
