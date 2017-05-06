
//=include vendor/jquery.ajaxchimp.js

var Newsletter = (function(w, d, $) {

    'use strict';

    var app, _private, _config;

    _config = {
        newsletter: $('#newsletter')
    },

    _private = {
        ajaxChimp: function() {
            _config.newsletter.ajaxChimp({
                callback: formCallback
            });

            function formCallback (resp) {
                if (resp.result === 'success') {

                    _config.newsletter.find('.input-group').addClass('hide');

                    // send GA event
                    if (!_dntEnabled()) {
                        GoogleAnalytics.gaEventNewsletterSuccess();
                    }

                }
                if (resp.result === 'error') {
                    _config.newsletter.find('.btn')
                        .removeClass('disabled')
                        .text('Subscribe');

                    // send GA event
                    if (!_dntEnabled()) {
                        GoogleAnalytics.gaEventNewsletterError();
                    }
                }
            }
        }
    };

    app = {
        init: function() {
            _private.ajaxChimp();
        }
    };

    return app;

})(window, document, jQuery);
