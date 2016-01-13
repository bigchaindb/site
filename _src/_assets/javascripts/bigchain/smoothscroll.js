
var SmoothScroll = (function(w, d) {

    'use strict';

    var app, _private, _config;

    // workaround for blog
    var $ = jQuery;

    _config = {
        win: $(window)
    },

    _private = {

        scrollToTarget: function() {

            // Check window width helper
            function isWide() {
                return _config.win.width() >= _config.minWidth;
            }

            $("a[href*='#']").not("[href='#'], .nav a[href*='#']").click(function(e) {
                if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

                    if (target.length) {
                        e.preventDefault();

                        if (typeof document.body.style.transitionProperty === 'string') {
                            var avail = $(document).height() - _config.win.height();

                            scroll = target.offset().top;

                            if (scroll > avail) {
                                scroll = avail;
                            }

                            $('html').css({
                                'transform': 'translate3d(0, ' + ( _config.win.scrollTop() - scroll ) + 'px, 0)',
                                'transition' : '.6s ease-in-out'
                            }).data('transitioning', true);
                        }
                        else {
                            // fallback for dumb browsers
                            $('html, body').animate({
                                scrollTop: target.offset().top
                            }, 600);
                        }
                    }
                }
            });
        },

        //
        // remove styles after transition has finished
        //
        removeStyles: function() {

            $('html').on('transitionend webkitTransitionEnd msTransitionEnd oTransitionEnd', function (e) {
                if (e.target == e.currentTarget && $(this).data('transitioning') === true) {
                    $(this).removeAttr('style').data('transitioning', false);
                    $('html, body').scrollTop(scroll);
                    return;
                }
            });
        }
    };

    app = {
        init: function() {
            _private.scrollToTarget();
            _private.removeStyles();
        }
    };

    return app;

})(window, document);
