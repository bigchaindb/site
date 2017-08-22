
document.addEventListener('DOMContentLoaded', function() {
    var trigger = document.getElementsByClassName('team__bio__trigger')[0]
    var bio = document.getElementsByClassName('team__bio')

    trigger.addEventListener('click', function(e) {
        for (var i = 0; i < bio.length; ++i) {
            var item = bio[i]
            if (item.style.display == 'block') {
                item.style.display = 'none'
                trigger.innerHTML = '<span>+</span>Show bios'
            } else {
                item.style.display = 'block'
                trigger.innerHTML = '<span>−</span>Hide bios'
            }
        }
    })
})
