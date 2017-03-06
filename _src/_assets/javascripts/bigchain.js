
//=include ../../../node_modules/svg4everybody/dist/svg4everybody.js
//=include ../../../node_modules/jquery/dist/jquery.js

//=include bigchain/analytics.js
//=include bigchain/forms.js
//=include bigchain/dnt.js

//=include bigchain/form-contact.js
//=include bigchain/newsletter.js


jQuery(function($) {

    //
    // init modules
    //
    Forms.init();
    FormContact.init();
    Newsletter.init();

    if (!_dntEnabled()) {
        GoogleAnalytics.init();
    }


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
