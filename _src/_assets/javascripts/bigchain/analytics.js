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
        gaEventEarlyAccessSuccess: function() {
            ga('send', 'event', 'signup', 'early_access_form', 'success');
        },
        gaEventEarlyAccessError: function() {
            ga('send', 'event', 'signup', 'early_access_form', 'error');
        }
    };

    return app;

})(window, document, jQuery);
