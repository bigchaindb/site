//=include popper.js/dist/umd/popper.js
//=include bootstrap/js/dist/util.js
//=include bootstrap/js/dist/dropdown.js

$('body').on('mouseenter mouseleave', '.dropdown', function(e) {
    var _d = $(e.target).closest('.dropdown')

    _d.addClass('show')

    setTimeout(function () {
        _d[_d.is(':hover') ? 'addClass' : 'removeClass']('show')
    }, 300)
})
