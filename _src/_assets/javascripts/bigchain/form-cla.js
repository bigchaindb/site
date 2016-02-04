
var FormCla = (function(w, d, $) {

    'use strict';

    var app, _private, _config;

    _config = {
        form:       $('.form-cla'),
        formBtn:    $('.form-cla').find('.btn'),
        formURL:    $('.form-cla').attr('action'),
        formMethod: $('.form-cla').attr('method')
    };

    _private = {
        formSubmit: function() {
            _config.form.submit(function(e) {
                e.preventDefault();

                if ( $(this).parsley().isValid() ) {
                    $.ajax({
                        url: _config.formURL,
                        type: _config.formMethod,
                        accept: {
                            javascript: 'application/javascript'
                        },
                        data: _config.form.serialize(),
                        crossDomain: true,
                        beforeSend: function() {
                            _config.formBtn
                                .addClass('disabled')
                                .attr('value', 'Sending...');
                        },
                        success: function(data) {
                            _config.form.find('.form-group').addClass('hide');
                            _config.form.find('.alert-success').removeClass('hide');
                            _config.formBtn.removeClass('disabled');
                        },
                        error: function(err) {
                            _config.form.find('.alert-danger').removeClass('hide');
                            _config.formBtn
                                .removeClass('disabled')
                                .attr('value', 'Send');
                        }
                    });
                }
            });
        }
    };

    app = {
        init: function() {
            _private.formSubmit();
        }
    };

    return app;

})(window, document, jQuery);
