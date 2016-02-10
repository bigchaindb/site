
//=include ../../../../node_modules/parsleyjs/dist/parsley.js

var Forms = (function(w, d, $) {

    'use strict'

    var app, _private, _config

    _config = {
        form: $('form'),
        parsleyForm: $('form.js-parsley')
    }

    _private = {
        formValidation: function() {
            // kick in Parsley.js but only if its js is present
            // and form has `js-parsley` class
            if ( window.Parsley && _config.form.hasClass('js-parsley') ) {
                _config.parsleyForm.parsley({
                    trigger: 'change'
                })
            }
        },
        formEmptyValidation: function() {
            _config.form.find('.form-control').each(function() {

                if ($(this).val() == '') {
                    $(this).addClass('is-empty')
                }

                $(this).blur(function() {
                    if ($(this).val() == '') {
                        $(this).addClass('is-empty')
                    } else {
                        $(this).removeClass('is-empty')
                    }
                })
            })
        }
    }

    app = {
        init: function() {
            _private.formValidation()
            _private.formEmptyValidation()
        }
    }

    return app

})(window, document, jQuery)
