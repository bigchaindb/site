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

        console.log(nextEvent)
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
