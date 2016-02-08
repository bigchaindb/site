
//=include bigchain/smoothscroll.js
//=include ../../../node_modules/vivus/dist/vivus.js


jQuery(function($) {

    // graph animation
    var iconOptions = {
        type: 'delayed',
        start: 'inViewport',
        duration: 200,
        animTimingFunction: Vivus.EASE_OUT,
        selfDestroy: true
    };

    new Vivus('bigchain-graph', iconOptions);

});
