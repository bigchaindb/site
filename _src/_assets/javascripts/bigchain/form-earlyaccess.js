
var FormEarlyAccess = (function(w, d, $) {

    'use strict';

    var app, _private, _config;

    _config = {
        form:       $('#form-earlyaccess'),
        formBtn:    $('#form-earlyaccess').find('.btn'),
        formURL:    $('#form-earlyaccess').attr('action')
    };

    _private = {
        formSubmit: function() {
            _config.form.submit(function(e) {
                e.preventDefault();

                if ( $(this).parsley().isValid() ) {

                    var data = {};
                    var dataArray = _config.form.serializeArray();
                    $.each(dataArray, function (index, item) {
                        data[item.name] = item.value;
                    });

                    $.ajax({
                        url: _config.formURL.replace('/post?', '/post-json?').concat('&c=?'),
                        data: data,
                        dataType: 'jsonp',
                        contentType: 'application/json; charset=utf-8',
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

                            // send GA event
                            GoogleAnalytics.gaEventEarlyAccessSuccess();
                        },
                        error: function(err) {
                            _config.form.find('.alert-danger').removeClass('hide');
                            _config.formBtn.removeClass('disabled');

                            // send GA event
                            GoogleAnalytics.gaEventEarlyAccessError();
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
