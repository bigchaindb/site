var HeroVideo = (function(w, d, $) {

    'use strict'

    var app, _private, _config

    _config = {
        heroVideo: $('.hero-video__video').get(0),
        minWidth: 720 // $screen-md
    }

    _private = {
        play: function() {
            if ( _config.heroVideo.paused ) {
                if ( _config.heroVideo.readyState < 4 ) {
                    _config.heroVideo.load();
                }
                _config.heroVideo.play();
                $(_config.heroVideo).addClass('enabled').removeClass('hide');
            }
        },
        pause: function() {
            _config.heroVideo.pause();
            $(_config.heroVideo).addClass('hide').removeClass('enabled');
        },
        isWide: function() {
            return $(window).width() >= _config.minWidth;
        },
    }

    app = {
        init: function() {
            $(window).on('load resize', function() {
                if (_private.isWide()) {
                    _private.play()
                } else {
                    _private.pause()
                }
            })
        }
    }

    return app

})(window, document, jQuery)
