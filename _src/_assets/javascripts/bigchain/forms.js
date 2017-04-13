
//=include parsleyjs/dist/parsley.js
//=include ../../../../node_modules/textarea-autogrow/textarea-autogrow.js
//=include ../../../../node_modules/select2/dist/js/select2.js

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
        },
        initAutogrow: function() {
            if (_config.form.find('textarea').length) {
                var textarea = document.querySelector('textarea')
                var growingTextarea = new Autogrow(textarea)
            }
        },
        initSelect: function(el) {
            _config.form.find('select').select2({
                minimumResultsForSearch: 15,
                theme: 'bigchaindb'
            });
        }
    }

    app = {
        init: function() {
            _private.formValidation()
            _private.formEmptyValidation()
            _private.initAutogrow()
            _private.initSelect()
        }
    }

    return app

})(window, document, jQuery)
