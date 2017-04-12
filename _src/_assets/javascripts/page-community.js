
//=include is-in-viewport/lib/isInViewport.js
//=include bigchain/testimonials.js
//=include bigchain/newsletter.js

jQuery(function($) {

    Newsletter.init()
    Testimonials.init()

    var wrigley     = $('#wrigley'),
        wrigleyArm  = wrigley.find('#arm'),
        wrigleyHead = wrigley.find('#head'),
        wrigleyEye  = wrigley.find('#eye');

    var wrigleyAnimationStart = function() {

        // set utility classes
        if (wrigley.is( ':in-viewport( -180 )' ) ) {
            wrigley.addClass('is-ready');

            // toggle paused class so the :hover interaction can fire animation again
            wrigleyArm.on('animationend webkitAnimationEnd oAnimationEnd', function(e) {
                    wrigleyArm.addClass('paused');
                    wrigleyHead.addClass('paused');

                    wrigley.on('mouseover', function() {
                        wrigleyArm.removeClass('paused');
                        wrigleyHead.removeClass('paused');
                    });

                    // fire eye blinking once other animations have finished
                    wrigleyEye.addClass('is-ready');

                    wrigleyEye.on('animationend webkitAnimationEnd oAnimationEnd', function(e) {
                        wrigleyEye.removeClass('is-ready');
                    });
                }
            );
        } else {
            wrigley.removeClass('is-ready').removeClass('paused');
            wrigleyArm.removeClass('paused');
            wrigleyHead.removeClass('paused');
            wrigleyEye.removeClass('is-ready').removeClass('paused');
        }
    }

    // fire all the viewport things
    wrigleyAnimationStart();
    $(window).on('load resize scroll', wrigleyAnimationStart);

});
