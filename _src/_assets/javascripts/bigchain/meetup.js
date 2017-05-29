//require whatwg-fetch/fetch.js

document.addEventListener('DOMContentLoaded', function() {

    const url = 'https://api.meetup.com/BigchainDB-IPDB-Meetup/events'

    function injectData(data) {
        const events = data

        // just grab the first item of array
        const nextEvent = events[0]
        const name = nextEvent.name
        const link = nextEvent.link
        const date = nextEvent.time
        const element = document.getElementsByClassName('js-social-link--meetup')[0]

        console.log(nextEvent)

        document.getElementsByClassName('meetup-title')[0].innerText = 'Next meetup: ' + name
        document.getElementsByClassName('meetup-title')[0].style.opacity = 1
        document.getElementsByClassName('js-social-link--meetup')[0].href = link
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
