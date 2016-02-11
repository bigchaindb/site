
var FormCla = (function(w, d, $) {

    'use strict';

    var app, _private, _config;

    _config = {
        form:         $('.form-cla'),
        formCheckbox: $('.form-cla').find('.agree'),
        formBtn:      $('.form-cla').find('.btn'),
        formURL:      $('.form-cla').attr('action'),
        formMethod:   $('.form-cla').attr('method')
    };

    _private = {
        formAgree: function() {

            // disable submit button by default
            _config.formBtn.addClass('disabled').attr('disabled', 'disabled');

            // toggle submit button state based on checkbox click
            _config.formCheckbox.on('click', function(){
                if ( $(this).is(':checked') ) {
                    _config.formBtn.removeClass('disabled').removeAttr('disabled');
                } else {
                    _config.formBtn.addClass('disabled').attr('disabled', 'disabled');
                }
            });
        },

        formSubmit: function() {
            _config.form.submit(function(e) {
                e.preventDefault();

                var thisForm   = $(this),
                    thisButton = thisForm.find('.btn');

                if ( thisForm.parsley().isValid() ) {
                    $.ajax({
                        url: _config.formURL,
                        method: _config.formMethod,
                        data: thisForm.serialize(),
                        dataType: 'json',
                        beforeSend: function() {
                            thisButton
                                .addClass('disabled')
                                .attr('value', 'Sending...');
                        },
                        success: function(data) {
                            thisForm.find('.form-group').addClass('hide');
                            thisForm.find('.alert-success').removeClass('hide');
                            thisButton.removeClass('disabled');
                        },
                        error: function(err) {
                            thisForm.find('.alert-danger').removeClass('hide');
                            thisButton
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
            _private.formAgree();
        }
    };

    return app;

})(window, document, jQuery);
