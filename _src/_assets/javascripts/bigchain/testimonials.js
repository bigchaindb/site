
//=include ../../../../node_modules/is-in-viewport/lib/isInViewport.js

var Testimonials = (function(w, d, $) {

    'use strict'

    var app, _private, _config

    _config = {
        testimonials: $('.testimonials'),
        testimonial: $('.testimonial')
    }

    _private = {
        toggleReady: function() {
            $(window).on('load resize scroll',function() {
                if (_config.testimonials.is( ':in-viewport()' ) ) {
                    _config.testimonials.addClass('is-ready');
                } else {
                    _config.testimonials.removeClass('is-ready');
                }
            });
        },
    }

    app = {
        init: function() {
            _private.toggleReady();
        }
    }

    return app

})(window, document, jQuery)
