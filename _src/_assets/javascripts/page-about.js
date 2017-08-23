
document.addEventListener('DOMContentLoaded', function() {
    var trigger = document.getElementsByClassName('team__bio__trigger')[0]
    var bio = document.getElementsByClassName('team__bio')

    trigger.addEventListener('click', function(e) {
        for (var i = 0; i < bio.length; ++i) {
            var item = bio[i]

            if (item.style.display == 'block') {
                item.style.display = 'none'
                trigger.innerHTML = '<span>+</span>Show bios'
                hide(item)
            } else {
                item.style.display = 'block'
                trigger.innerHTML = '<span>−</span>Hide bios'
                show(item)
            }
        }
    })
})

function show(ele) {
    raf = window.requestAnimationFrame(function() {
        var opacity = 0
        var height = 0

        function increase () {
            opacity += 0.1
            height += 1
            if (opacity >= 1) {
                // complete
                ele.style.opacity = 1
                ele.style.height = '100%'
                return true
            }
            ele.style.opacity = opacity
            ele.style.height = height + '%'

            requestAnimationFrame(increase)
        }
        increase()
    });
}

function hide(ele) {
    raf = window.requestAnimationFrame(function() {
        var opacity = 1
        var height = '100%'
        function decrease () {
            opacity += 0.1
            height += 1
            if (opacity >= 1) {
                // complete
                ele.style.opacity = 0
                ele.style.height = 0
                return true
            }
            ele.style.opacity = opacity
            ele.style.height = height + '%'
            requestAnimationFrame(decrease)
        }
        decrease()
    })
}
