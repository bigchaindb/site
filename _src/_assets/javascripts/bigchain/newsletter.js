
//=include ../vendor/jquery.ajaxchimp.js

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
                    ga('send', 'event', 'newsletter', 'subscribe', 'success', true);
                }
                if (resp.result === 'error') {
                    _config.newsletter.find('.btn')
                        .removeClass('disabled')
                        .text('Subscribe');

                    // send GA event
                    ga('send', 'event', 'newsletter', 'subscribe', 'error', true);
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
