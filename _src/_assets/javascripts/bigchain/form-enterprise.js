
var FormEnterprise = (function(w, d, $) {

    'use strict';

    var app, _private, _config;

    _config = {
        form:       $('#form-enterprise'),
        formBtn:    $('#form-enterprise').find('.btn'),
        formURL:    $('#form-enterprise').attr('action'),
        formMethod: $('#form-enterprise').attr('method')
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
                            _config.form.find('.alert-success').removeClass('hide');
                            _config.formBtn.removeClass('disabled');

                            // send GA event
                            if (!_dntEnabled()) {
                                //GoogleAnalytics.gaEventContactSuccess();
                            }
                        },
                        error: function(err) {
                            _config.form.find('.alert-danger').removeClass('hide');
                            _config.formBtn
                                .removeClass('disabled')
                                .attr('value', 'Send');

                            // send GA event
                            if (!_dntEnabled()) {
                                //GoogleAnalytics.gaEventContactError();
                            }
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
