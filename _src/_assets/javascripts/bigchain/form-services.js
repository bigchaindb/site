
var FormServices = (function(w, d, $) {

    'use strict';

    var app, _private, _config;

    _config = {
        form:       $('#form-services'),
        formBtn:    $('#form-services').find('.btn'),
        formURL:    $('#form-services').attr('action'),
        formMethod: $('#form-services').attr('method')
    };

    _private = {
        formSubmit: function() {
            _config.form.submit(function(e) {
                e.preventDefault();

                if ( $(this).parsley().isValid() ) {
                    $.ajax({
                        url: _config.formURL,
                        method: _config.formMethod,
                        data: $(this).serialize(),
                        dataType: 'json',
                        beforeSend: function() {
                            _config.formBtn
                                .addClass('disabled')
                                .attr('value', 'Sending...');
                        },
                        success: function(data) {
                            _config.form.find('.form-group').addClass('hide');
                            _config.form.find('.alert--success').removeClass('hide');
                            _config.formBtn.removeClass('disabled');

                            // send GA event
                            if (!_dntEnabled()) {
                                GoogleAnalytics.gaEventServicesSuccess();
                            }
                        },
                        error: function(err) {
                            _config.form.find('.alert--danger').removeClass('hide');
                            _config.formBtn
                                .removeClass('disabled')
                                .attr('value', 'Send');

                            // send GA event
                            if (!_dntEnabled()) {
                                GoogleAnalytics.gaEventServicesError();
                            }
                        }
                    });
                }
            });
        }
    };

    app = {
        init: function() {
            _private.formSubmit()
        }
    };

    return app;

})(window, document, jQuery)
