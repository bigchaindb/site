
//include whatwg-fetch/fetch.js

document.addEventListener('DOMContentLoaded', function() {

    const url = 'https://bigchaindb-github.now.sh'

    function injectData(data) {
        let repos = data

        // just grab the first item of array
        // should always be bigchaindb/bigchaindb cause of ordering by most stars
        const repo = repos[0]
        const stars = repo.stars
        const release = repo.release

        document.getElementById('stars').innerText = stars
        document.getElementById('release').innerText = release
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
