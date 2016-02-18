
//=include ../vendor/jquery.ajaxchimp.js

var Newsletter = (function(w, d, $) {

    'use strict';

    var app, _private, _config;

    _config = {
        newsletter: $('#newsletter')
    },

    _private = {
        parsley: function() {
            if (_config.newsletter.length > 0) {
                _config.newsletter.parsley({
                    trigger: 'change'
                });
            }
        },

        ajaxChimp: function() {
            _config.newsletter.ajaxChimp();
        }
    };

    app = {
        init: function() {
            _private.parsley();
            _private.ajaxChimp();
        }
    };

    return app;

})(window, document, jQuery);
