
//=include svg4everybody/dist/svg4everybody.js
//=include jquery/dist/jquery.js
//=include smooth-scroll/dist/js/smooth-scroll.js

//=include bigchain/analytics.js
//=include bigchain/dnt.js

//=include bigchain/forms.js

jQuery(function($) {

    //
    // init global modules
    //
    Forms.init()

    if (!_dntEnabled()) {
        GoogleAnalytics.init();
    }


    //
    // init Smooth Scroll
    //
    var scroll = new SmoothScroll('a[data-scroll], .toc-entry a', {
        easing: 'easeOutQuint'
    });


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
    $('.content--page--markdown h1:not(#heading-1), .content--page--markdown h2:not(#heading-2)').each(function(i, el) {
        var $el, icon, id;
        $el = $(el);
        id = $el.attr('id');
        icon = '<i class="header-icon">#</i>';
        if (id) {
        return $el.prepend($('<a />').addClass('header-link').attr('href', '#' + id).html(icon));
        }
    });

});
