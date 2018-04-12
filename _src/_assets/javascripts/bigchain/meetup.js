document.addEventListener('DOMContentLoaded', function() {

    const url = 'https://bigchaindb-meetups.now.sh'

    function injectData(data) {
        const events = data

        // just grab the first item of array
        const nextEvent = events[0]
        const name = nextEvent.name
        const link = nextEvent.link
        const date = new Date(nextEvent.time).toLocaleDateString('en-us', { month: 'short', day: 'numeric' })
        const element = document.getElementsByClassName('js-social-link--meetup')[0]
        const elementTitle = document.getElementsByClassName('meetup-title')[0]

        elementTitle.innerHTML = '<span class="hero__community__label">' + date + '</span> ' + '<strong>' + name + '</strong>'
        elementTitle.style.opacity = 1
        element.href = link
    }

    fetch(url)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            injectData(data)
        })
        .catch(function(error) {
            console.log(error)
        })
})
