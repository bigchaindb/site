
//=include ../../../node_modules/is-in-viewport/lib/isInViewport.js

jQuery(function($) {

    // start wrigely animation when in viewport
    var wrigely = $('#wrigely');

    if (wrigely.isInViewport() ) {
        wrigely.addClass('is-ready');
    } else {
        wrigely.removeClass('is-ready');
    }

});
