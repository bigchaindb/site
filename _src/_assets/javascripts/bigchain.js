
//=include ../../../node_modules/svg4everybody/dist/svg4everybody.js
//=include ../../../node_modules/jquery/dist/jquery.js

//=include bigchain/analytics.js
//=include bigchain/forms.js
//=include bigchain/smoothscroll.js
//=include bigchain/dnt.js

//=include bigchain/form-earlyaccess.js
//=include bigchain/form-contact.js
//=include bigchain/hero-video.js

jQuery(function($) {

    //
    // init modules
    //
    Forms.init();
    SmoothScroll.init();
    FormEarlyAccess.init();

    if ($('.hero-video').length > 0) {
        HeroVideo.init();
    }

    if (!_dntEnabled()) {
        GoogleAnalytics.init();
    }

    $('.hero .logo').on('animationend webkitAnimationEnd oAnimationEnd',
        function(e) {
            $('.hero').addClass('is-ready');
        }
    );


    //
    // Automatically add header links to all Markdown headings
    //
    $('.content--page--markdown h1, .content--page--markdown h2').each(function(i, el) {
        var $el, icon, id;
        $el = $(el);
        id = $el.attr('id');
        icon = '<i class="header-icon">#</i>';
        if (id) {
        return $el.prepend($('<a />').addClass('header-link').attr('href', '#' + id).html(icon));
        }
    });

});
