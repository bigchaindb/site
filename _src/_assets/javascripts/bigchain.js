
//=include ../../../node_modules/svg4everybody/dist/svg4everybody.js
//=include ../../../node_modules/jquery/dist/jquery.js

//=include ../../../node_modules/foundation-sites/js/foundation.core.js
//=include ../../../node_modules/foundation-sites/js/foundation.util.keyboard.js
//=include ../../../node_modules/foundation-sites/js/foundation.tabs.js

//=include bigchain/analytics.js
//=include bigchain/forms.js
//=include bigchain/dnt.js
//=include bigchain/tab.js

//=include bigchain/form-earlyaccess.js
//=include bigchain/form-contact.js
//=include bigchain/form-cla.js
//=include bigchain/hero-video.js

jQuery(function($) {

    //
    // init modules
    //
    Forms.init();
    FormEarlyAccess.init();
    FormCla.init();

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
    // Open all external links in new window
    //
    $('a').not('[href*="mailto:"]').each(function () {
        var isInternalLink = new RegExp('/' + window.location.host + '/');
        if ( !isInternalLink.test(this.href) ) {
            $(this).attr('target', '_blank');
        }
    });


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
