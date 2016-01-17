
//=include ../../../node_modules/svg4everybody/dist/svg4everybody.js
//=include ../../../node_modules/jquery/dist/jquery.js

//=include bigchain/analytics.js
//=include bigchain/forms.js
//=include bigchain/smoothscroll.js
//=include bigchain/dnt.js

//=include bigchain/form-earlyaccess.js

jQuery(function($) {

    //
    // init modules
    //
    Forms.init();
    SmoothScroll.init();
    FormEarlyAccess.init();

    if (!_dntEnabled()) {
        GoogleAnalytics.init();
    }

    $('.hero .logo').on('animationend webkitAnimationEnd oAnimationEnd',
        function(e) {
            $('.hero').addClass('is-ready');
        }
    );

});
