
//=include ../../../node_modules/is-in-viewport/lib/isInViewport.js

jQuery(function($) {

    // start Buffy animation when in viewport
    var buffy = $('#buffy');

    if (buffy.isInViewport() ) {
        buffy.addClass('is-ready');
    } else {
        buffy.removeClass('is-ready');
    }

});
