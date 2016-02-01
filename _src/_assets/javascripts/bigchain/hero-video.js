// the real thing
function HeroVideo(elm) {
    var heroVideo = $(elm || '.hero-video__video').get(0);
    var minWidth = 768;

    var pause = function() {
        heroVideo.pause();
    };

    var play = function() {
        if (heroVideo.paused) {
            if (heroVideo.readyState < 4) {
                heroVideo.load();
            }
            heroVideo.play();
        }
    };

    var enable = function() {
        $(heroVideo).addClass('enabled');
    };

    function supportsVideoFormat(video, fmt) {
        return video && (video.canPlayType('video/' + fmt) !== '');
    }

    function isHTML5VideoSupported() {
        if (supportsVideoFormat(heroVideo, 'mp4') ||
            supportsVideoFormat(heroVideo, 'webm')) {

            $.each(['playing'], function(_, eventName) {
                heroVideo.addEventListener(eventName, enable);
            });

            return true;
        }
    }

    // Check window width helper
    function isWide() {
        return $(window).width() >= minWidth;
    }

    function updateVideoState() {
        if (isWide()) {
            play();
        } else {
            pause();
            $(heroVideo).removeClass('enabled');
        }
    }

    function trackWidth() {
        $(window).resize(function() {
            updateVideoState();
        });
    }

    if (isHTML5VideoSupported()) {
        updateVideoState();
        trackWidth();
    }

    return {
        play: play,
        pause: pause,
        enable: enable,
        isWide: isWide,
        trackWidth: trackWidth
    };
}

// fire all the things
if (HeroVideo().isWide()) {
    HeroVideo().play();
}
HeroVideo().trackWidth();
