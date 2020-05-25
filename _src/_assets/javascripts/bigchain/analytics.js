//
// Google Analytics
//
var GoogleAnalytics = (function(w,d,$) {

    var app, _private;

    _private = {
        //
        // Custom Events
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
        //
        gaEvents: function() {
            // jQuery('.js-tracking-').on('click', function() {
            //     ga('send', 'event', [eventCategory], [eventAction], [eventLabel]);
            // });

            // Menu clicks
            $('.js-tracking-menu').on('click', function() {
                ga('send', 'event', 'menu_click', 'link_click', 'text_link', true);
            });

            // Terminal interaction
            $('.js-tracking-terminal').on('click', function() {
                ga('send', 'event', 'terminal', 'terminal_click', 'selection', true);
            });

            // Whitepaper download
            $('.js-tracking-whitepaper-download').on('click', function() {
                ga('send', 'event', 'whitepaper', 'download', 'button', true);
            });

            // Social links
            $('.js-social-link').on('click', function() {

                var href    = this.getAttribute('href'),
                    network = extractDomain(href);

                ga('send', 'event', 'social', 'click', network);
            });

            function extractDomain(url) {
                var domain;
                //find & remove protocol (http, ftp, etc.) and get domain
                if (url.indexOf("://") > -1) {
                    domain = url.split('/')[2];
                }
                else {
                    domain = url.split('/')[0];
                }

                //find & remove port number
                domain = domain.split(':')[0];

                return domain;
            }
        },


        //
        // Track Responsive Breakpoints
        //
        // stolen & adapted from
        // http://philipwalton.com/articles/measuring-your-sites-responsive-breakpoint-usage/
        //
        gaBreakpoints: function() {
            // Do nothing in browsers that don't support `window.matchMedia`.
            if (!window.matchMedia) return;

            // Prevent rapid breakpoint changes for all firing at once.
            var timeout;

            var breakpoints = {
                xs: '(max-width: 39.999em)',
                sm: '(min-width: 40em) and (max-width: 49.999)',
                md: '(min-width: 50em) and (max-width: 84.999)',
                lg: '(min-width: 85em)'
            };

            Object.keys(breakpoints).forEach(function(breakpoint) {
                var mql = window.matchMedia(breakpoints[breakpoint]);

                // Set the initial breakpoint on page load.
                if (mql.matches) {
                    ga('set', 'dimension1', breakpoint);
                }

                // Update the breakpoint as the matched media changes
                mql.addListener(function() {
                    if (mql.matches) {
                        clearTimeout(timeout);
                        timeout = setTimeout(function() {
                            ga('set', 'dimension1', breakpoint);
                        }, 1000);
                    }
                });
            });
        },


        //
        // Track Viewport
        //
        gaViewport: function() {
            var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            var dimensions = width + 'x' + height;

            ga('set', 'dimension2', dimensions);
        },


        //
        // Track Pixel Density
        //
        gaPixelDensity: function() {
            // Heads up!
            // window.devicePixelRatio doesn't work correctly in IE but whatever
            var pixeldensity = window.devicePixelRatio;

            ga('set', 'dimension3', pixeldensity);
        }

    };

    app = {
        init: function() {
            _private.gaEvents();
            _private.gaBreakpoints();
            _private.gaViewport();
            _private.gaPixelDensity();
        },

        //
        // All custom events
        //

        // newsletter forms
        gaEventNewsletterSuccess: function() {
            ga('send', 'event', 'newsletter', 'subscribe', 'success');
        },
        gaEventNewsletterError: function() {
            ga('send', 'event', 'newsletter', 'subscribe', 'error');
        },

        // contact forms
        gaEventContactSuccess: function() {
            ga('send', 'event', 'contact', 'contact_form', 'success');
        },
        gaEventContactError: function() {
            ga('send', 'event', 'contact', 'contact_form', 'error');
        },

        // CLA forms
        gaEventClaSuccess: function() {
            ga('send', 'event', 'cla', 'cla_form', 'success');
        },
        gaEventClaError: function() {
            ga('send', 'event', 'cla', 'cla_form', 'error');
        }
    };

    return app;

})(window, document, jQuery);
